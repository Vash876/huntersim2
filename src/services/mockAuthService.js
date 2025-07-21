/**
 * Mock Authentication Service for Development
 * Use this when Google OAuth is not available during development
 */
export class MockAuthService {
  constructor() {
    this.user = null;
    this.isInitialized = true; // Always ready
  }

  async initGoogleAuth() {
    console.log('🧪 Mock Auth: Already initialized');
    return Promise.resolve();
  }

  async signIn() {
    console.log('🧪 Mock Auth: Simulating sign in...');
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.user = {
      id: 'mock-user-123',
      email: 'developer@test.com',
      name: 'Test Developer',
      picture: 'https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=TD',
      token: 'mock-jwt-token'
    };

    console.log('🧪 Mock Auth: Sign in successful', this.user);
    return this.user;
  }

  signOut() {
    console.log('🧪 Mock Auth: Signing out...');
    this.user = null;
    localStorage.removeItem('cifi-user');
  }

  getCurrentUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.user;
  }
}

// Export singleton
export const mockAuthService = new MockAuthService();
