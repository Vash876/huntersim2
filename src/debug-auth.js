// Debug: Stack Auth Environment Check
console.log('=== STACK AUTH DEBUG INFO ===');
console.log('Environment:', import.meta.env.MODE);
console.log('VITE_STACK_PROJECT_ID:', import.meta.env.VITE_STACK_PROJECT_ID);
console.log('VITE_STACK_PUBLISHABLE_CLIENT_KEY exists:', !!import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY);
console.log('VITE_STACK_BASE_URL:', import.meta.env.VITE_STACK_BASE_URL);
console.log('Current URL:', window.location.href);
console.log('Expected callback URL:', `${window.location.protocol}//${window.location.host}/handler/oauth-callback`);
console.log('==============================');

// Check if Stack Auth is properly initialized
import { stackClientApp } from '@/services/stackAuth';
console.log('Stack Client App:', stackClientApp);
console.log('Stack Client App projectId:', stackClientApp.projectId);
console.log('Stack Client App baseUrl:', stackClientApp.baseUrl);

// Test OAuth redirect URL generation
setTimeout(async () => {
  try {
    console.log('=== TESTING OAUTH REDIRECT ===');
    console.log('Testing if Stack Auth can generate OAuth URLs...');
    
    // Try to get current user (should be null, but tests connection)
    const currentUser = await stackClientApp.getUser();
    console.log('Current user:', currentUser);
    
    console.log('Stack Auth connection test successful!');
    console.log('================================');
  } catch (error) {
    console.error('Stack Auth connection test failed:', error);
    console.log('This might be normal if not authenticated yet.');
  }
}, 1000);
