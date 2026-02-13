/**
 * Vue.js Wrapper for Neon Auth (Stack Auth)
 * Provides Vue-compatible auth methods and reactivity
 */
import { ref, computed } from 'vue';
import { stackClientApp } from './stackAuth';
import { checkAndCacheSecretAccess } from '../constants/navigation';

class NeonAuthService {
  constructor() {
    // Reactive state
    this.user = ref(null);
    this.isAuthenticated = ref(false);
    this.isLoading = ref(true);
    this.error = ref(null);
    
    // Initialize auth state
    this.init();
  }

  async init() {
    try {
      this.isLoading.value = true;
      this.error.value = null;

      // Check if user is already authenticated
      const currentUser = await stackClientApp.getUser();
      
      if (currentUser) {
        this.user.value = currentUser;
        this.isAuthenticated.value = true;
        // Update secret access cache
        checkAndCacheSecretAccess(currentUser.id);
      } else {
        this.user.value = null;
        this.isAuthenticated.value = false;
        // Clear secret access cache if not logged in
        checkAndCacheSecretAccess(null);
      }

      // Stack Auth doesn't have onUserChange, we'll poll for changes or use events
      // For now, we rely on the UI triggering auth state updates

    } catch (error) {
      console.error('Neon Auth initialization failed:', error);
      this.error.value = error.message;
    } finally {
      this.isLoading.value = false;
    }
  }

  // Manually refresh auth state (useful after OAuth callback)
  async refreshAuthState() {
    try {
      const currentUser = await stackClientApp.getUser();
      
      if (currentUser) {
        this.user.value = currentUser;
        this.isAuthenticated.value = true;
        checkAndCacheSecretAccess(currentUser.id);
        
        // Trigger the callback if it exists
        if (this.onAuthStateChanged) {
          this.onAuthStateChanged(currentUser);
        }
      } else {
        this.user.value = null;
        this.isAuthenticated.value = false;
        checkAndCacheSecretAccess(null);
        
        // Trigger the callback if it exists
        if (this.onAuthStateChanged) {
          this.onAuthStateChanged(null);
        }
      }
      
      return currentUser;
    } catch (error) {
      console.error('Neon Auth refresh auth state failed:', error);
      this.error.value = error.message;
      throw error;
    }
  }

  // Sign in with email/password
  async signIn(email, password) {
    try {
      this.isLoading.value = true;
      this.error.value = null;

      let result;
      // Try different possible method names for credential sign in
      if (stackClientApp.signInWithCredential) {
        result = await stackClientApp.signInWithCredential({ email, password });
      } else if (stackClientApp.signInWithPassword) {
        result = await stackClientApp.signInWithPassword({ email, password });
      } else if (stackClientApp.signInWithEmailAndPassword) {
        result = await stackClientApp.signInWithEmailAndPassword(email, password);
      } else if (stackClientApp.signIn) {
        result = await stackClientApp.signIn({ email, password });
      } else {
        throw new Error('Sign in methods not available in Stack Auth SDK');
      }

      if (result && result.user) {
        this.user.value = result.user;
        this.isAuthenticated.value = true;
        return result.user;
      } else {
        throw new Error('Sign in failed - no user returned');
      }
    } catch (error) {
      console.error('Neon Auth sign in failed:', error);
      this.error.value = error.message || 'Sign in failed';
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  // Sign up with email/password
  async signUp(email, password, displayName = null) {
    try {
      this.isLoading.value = true;
      this.error.value = null;

      let result;
      // Try different possible method names for credential sign up
      if (stackClientApp.signUpWithCredential) {
        result = await stackClientApp.signUpWithCredential({ email, password });
      } else if (stackClientApp.signUpWithPassword) {
        result = await stackClientApp.signUpWithPassword({ email, password });
      } else if (stackClientApp.signUpWithEmailAndPassword) {
        result = await stackClientApp.signUpWithEmailAndPassword(email, password);
      } else if (stackClientApp.signUp) {
        result = await stackClientApp.signUp({ email, password });
      } else {
        throw new Error('Sign up methods not available in Stack Auth SDK');
      }

      if (result && result.user) {
        this.user.value = result.user;
        this.isAuthenticated.value = true;
        
        // If displayName was provided, try different methods to set it
        if (displayName && displayName.trim()) {
          const trimmedName = displayName.trim();
          
          try {
            // Try method 1: updateUser
            if (stackClientApp.updateUser) {
              const updatedUser = await stackClientApp.updateUser({ displayName: trimmedName });
              if (updatedUser) this.user.value = updatedUser;
            } else if (stackClientApp.updateCurrentUser) {
              // Try method 2: updateCurrentUser
              const updatedUser = await stackClientApp.updateCurrentUser({ displayName: trimmedName });
              if (updatedUser) this.user.value = updatedUser;
            }
          } catch (updateError) {
            console.warn('Neon Auth: Display name update failed:', updateError);
          }
        }
        
        return this.user.value;
      } else {
        throw new Error('Sign up failed - no user returned');
      }
    } catch (error) {
      console.error('Neon Auth sign up failed:', error);
      this.error.value = error.message || 'Sign up failed';
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  // Sign out
  async signOut() {
    try {
      this.isLoading.value = true;
      this.error.value = null;

      await stackClientApp.signOut();
      
      this.user.value = null;
      this.isAuthenticated.value = false;
      // Clear secret access cache on logout
      checkAndCacheSecretAccess(null);
      
      return true;
    } catch (error) {
      console.error('Neon Auth sign out failed:', error);
      this.error.value = error.message;
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      this.isLoading.value = true;
      this.error.value = null;

      // Try different possible method names for password reset
      if (stackClientApp.sendPasswordResetEmail) {
        await stackClientApp.sendPasswordResetEmail(email);
      } else if (stackClientApp.resetPassword) {
        await stackClientApp.resetPassword(email);
      } else if (stackClientApp.sendResetPasswordEmail) {
        await stackClientApp.sendResetPasswordEmail(email);
      } else if (stackClientApp.forgotPassword) {
        await stackClientApp.forgotPassword(email);
      } else {
        throw new Error('Password reset methods not available in Stack Auth SDK');
      }
      
      return true;
    } catch (error) {
      console.error('Neon Auth password reset failed:', error);
      this.error.value = error.message || 'Password reset failed';
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  // Google OAuth sign in
  async signInWithGoogle() {
    try {
      this.isLoading.value = true;
      this.error.value = null;

      // Try the actual Stack Auth OAuth methods
      if (stackClientApp.redirectToSignIn) {
        await stackClientApp.redirectToSignIn();
      } else if (stackClientApp.signInWithOAuth) {
        await stackClientApp.signInWithOAuth('google');
      } else if (stackClientApp.redirectToOAuth) {
        await stackClientApp.redirectToOAuth('google');
      } else if (stackClientApp.signInWithProvider) {
        await stackClientApp.signInWithProvider('google');
      } else if (stackClientApp.oauthSignIn) {
        await stackClientApp.oauthSignIn('google');
      } else {
        throw new Error('OAuth methods not available in Stack Auth SDK');
      }
      
      // This code won't run because the user gets redirected
      // The actual sign-in completion happens in the OAuth callback handler
      
    } catch (error) {
      console.error('Neon Auth Google sign in failed:', error);
      this.error.value = error.message || 'Google sign in failed';
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  // GitHub OAuth sign in
  async signInWithGitHub() {
    try {
      this.isLoading.value = true;
      this.error.value = null;

      // Try the actual Stack Auth OAuth methods
      if (stackClientApp.redirectToSignIn) {
        await stackClientApp.redirectToSignIn();
      } else if (stackClientApp.signInWithOAuth) {
        await stackClientApp.signInWithOAuth('github');
      } else if (stackClientApp.redirectToOAuth) {
        await stackClientApp.redirectToOAuth('github');
      } else if (stackClientApp.signInWithProvider) {
        await stackClientApp.signInWithProvider('github');
      } else if (stackClientApp.oauthSignIn) {
        await stackClientApp.oauthSignIn('github');
      } else {
        throw new Error('OAuth methods not available in Stack Auth SDK');
      }
      
      // This code won't run because the user gets redirected
      // The actual sign-in completion happens in the OAuth callback handler
      
    } catch (error) {
      console.error('Neon Auth GitHub sign in failed:', error);
      this.error.value = error.message || 'GitHub sign in failed';
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  // Update user display name
  async updateUserDisplayName(displayName) {
    try {
      this.isLoading.value = true;
      this.error.value = null;

      if (!displayName || !displayName.trim()) {
        throw new Error('Display name cannot be empty');
      }

      const trimmedName = displayName.trim();

      // Try different methods to update the user display name
      let updatedUser = null;
      
      if (stackClientApp.updateUser) {
        updatedUser = await stackClientApp.updateUser({ displayName: trimmedName });
      } else if (stackClientApp.updateCurrentUser) {
        updatedUser = await stackClientApp.updateCurrentUser({ displayName: trimmedName });
      } else if (stackClientApp.updateProfile) {
        updatedUser = await stackClientApp.updateProfile({ displayName: trimmedName });
      } else if (this.user.value && this.user.value.update) {
        updatedUser = await this.user.value.update({ displayName: trimmedName });
      } else {
        throw new Error('User update methods not available in Stack Auth SDK');
      }

      // Update local user state if successful
      if (updatedUser) {
        this.user.value = updatedUser;
      } else {
        // Refresh user data if no updated user returned
        await this.refreshAuthState();
      }

      return this.user.value;

    } catch (error) {
      console.error('Neon Auth update display name failed:', error);
      this.error.value = error.message || 'Display name update failed';
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  // Utility methods
  getCurrentUser() {
    return this.user.value;
  }

  isSignedIn() {
    return this.isAuthenticated.value;
  }

  getUserEmail() {
    return this.user.value?.primaryEmail || null;
  }

  getUserDisplayName() {
    return this.user.value?.displayName || this.user.value?.primaryEmail || 'User';
  }

  getUserId() {
    return this.user.value?.id || null;
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

  // Event handler for auth state changes
  onAuthStateChanged = null;

  // Clear error
  clearError() {
    this.error.value = null;
  }

  // Alias for init() - for compatibility
  async initAuth() {
    return await this.init();
  }
}

// Export singleton instance
export const neonAuthService = new NeonAuthService();
export default neonAuthService;
