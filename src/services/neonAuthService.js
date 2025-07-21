/**
 * Vue.js Wrapper for Neon Auth (Stack Auth)
 * Provides Vue-compatible auth methods and reactivity
 */
import { ref, computed } from 'vue';
import { stackClientApp } from './stackAuth';

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

      console.log('Neon Auth init: Checking authentication status...');
      console.log('stackClientApp:', stackClientApp);
      console.log('Available methods:', Object.getOwnPropertyNames(stackClientApp.__proto__));

      // Check if user is already authenticated
      const currentUser = await stackClientApp.getUser();
      
      console.log('stackClientApp.getUser() result:', currentUser);
      
      if (currentUser) {
        this.user.value = currentUser;
        this.isAuthenticated.value = true;
        console.log('Neon Auth: User already authenticated', currentUser.primaryEmail || currentUser.email);
      } else {
        this.user.value = null;
        this.isAuthenticated.value = false;
        console.log('Neon Auth: No authenticated user');
      }

      // Stack Auth doesn't have onUserChange, we'll poll for changes or use events
      // For now, we rely on the UI triggering auth state updates

    } catch (error) {
      console.error('Neon Auth initialization failed:', error);
      this.error.value = error.message;
    } finally {
      this.isLoading.value = false;
      console.log('Neon Auth init complete. Final state:', {
        isAuthenticated: this.isAuthenticated.value,
        user: this.user.value
      });
    }
  }

  // Manually refresh auth state (useful after OAuth callback)
  async refreshAuthState() {
    try {
      console.log('Neon Auth: Refreshing auth state...');
      const currentUser = await stackClientApp.getUser();
      
      if (currentUser) {
        this.user.value = currentUser;
        this.isAuthenticated.value = true;
        console.log('Neon Auth: Auth state refreshed - user authenticated', currentUser.primaryEmail || currentUser.email);
        
        // Trigger the callback if it exists
        if (this.onAuthStateChanged) {
          this.onAuthStateChanged(currentUser);
        }
      } else {
        this.user.value = null;
        this.isAuthenticated.value = false;
        console.log('Neon Auth: Auth state refreshed - no user');
        
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

      console.log('Neon Auth: Attempting sign in with email:', email);
      
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

      console.log('Neon Auth: Sign in result:', result);

      if (result && result.user) {
        this.user.value = result.user;
        this.isAuthenticated.value = true;
        console.log('Neon Auth: Sign in successful', result.user.primaryEmail || result.user.email);
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

      console.log('Neon Auth: Attempting sign up with email:', email, 'displayName:', displayName);

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

      console.log('Neon Auth: Sign up result:', result);

      if (result && result.user) {
        this.user.value = result.user;
        this.isAuthenticated.value = true;
        
        // If displayName was provided, try different methods to set it
        if (displayName && displayName.trim()) {
          const trimmedName = displayName.trim();
          console.log('Neon Auth: Attempting to set display name to:', trimmedName);
          
          try {
            // Try method 1: updateUser
            if (stackClientApp.updateUser) {
              const updatedUser = await stackClientApp.updateUser({ displayName: trimmedName });
              console.log('Neon Auth: updateUser result:', updatedUser);
              if (updatedUser) this.user.value = updatedUser;
            } else if (stackClientApp.updateCurrentUser) {
              // Try method 2: updateCurrentUser
              const updatedUser = await stackClientApp.updateCurrentUser({ displayName: trimmedName });
              console.log('Neon Auth: updateCurrentUser result:', updatedUser);
              if (updatedUser) this.user.value = updatedUser;
            }
          } catch (updateError) {
            console.warn('Neon Auth: Display name update failed:', updateError);
          }
        }
        
        console.log('Neon Auth: Sign up successful', result.user.primaryEmail || result.user.email, 'final displayName:', this.user.value.displayName || this.user.value.display_name);
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
      
      console.log('Neon Auth: Sign out successful');
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

      console.log('Neon Auth: Sending password reset email to:', email);

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
      
      console.log('Neon Auth: Password reset email sent to', email);
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

      console.log('Neon Auth: Attempting Google OAuth sign in');

      // Stack Auth OAuth redirect methods - try different possible names
      if (stackClientApp.signInWithOAuth) {
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

      console.log('Neon Auth: Attempting GitHub OAuth sign in');

      // Stack Auth OAuth redirect methods - try different possible names
      if (stackClientApp.signInWithOAuth) {
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

  // Utility methods
  getCurrentUser() {
    console.log('getCurrentUser called, user.value:', this.user.value);
    return this.user.value;
  }

  isSignedIn() {
    console.log('isSignedIn called, isAuthenticated.value:', this.isAuthenticated.value);
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
