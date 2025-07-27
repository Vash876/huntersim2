<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-900">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <h2 class="text-xl font-semibold text-white mb-2">Signing you in...</h2>
      <p class="text-gray-400">Please wait while we complete your authentication.</p>
      
      <div v-if="error" class="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
        <h3 class="text-red-300 font-semibold mb-2">Authentication Error</h3>
        <p class="text-red-300 mb-3">{{ error }}</p>
        
        <!-- Show debug info in development -->
        <div v-if="debugInfo && isDev" class="mt-3 p-3 bg-gray-800 rounded text-xs">
          <h4 class="text-gray-300 font-semibold mb-2">Debug Information:</h4>
          <pre class="text-gray-400 whitespace-pre-wrap">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
        </div>
        
        <div class="flex space-x-2 mt-3">
          <button 
            @click="redirectToHome"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Continue to App
          </button>
          <button 
            @click="retryAuth"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Retry Authentication
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { neonAuthService } from '@/services/neonAuthService';
import { stackClientApp } from '@/services/stackAuth';

const route = useRoute();
const router = useRouter();
const error = ref(null);
const debugInfo = ref(null);
const isDev = import.meta.env.DEV;

onMounted(async () => {
  try {
    // Extract OAuth parameters from URL
    const { code, state, error: oauthError, error_description } = route.query;
    
    // Add URL search params as backup
    const urlParams = new URLSearchParams(window.location.search);
    const urlCode = urlParams.get('code');
    const urlError = urlParams.get('error');
    
    // Check if Stack Auth is properly configured
    if (!import.meta.env.VITE_STACK_PROJECT_ID || !import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY) {
      error.value = 'Authentication service is not properly configured. Please check environment variables.';
      return;
    }
    
    // Check for OAuth error first
    if (oauthError || urlError) {
      const errorMsg = oauthError || urlError;
      const errorDesc = error_description || 'No additional details';
      error.value = `Authentication failed: ${errorMsg}. ${errorDesc}`;
      return;
    }
    
    const authCode = code || urlCode;
    
    if (authCode) {
      // We have an OAuth code, use Stack Auth's callOAuthCallback method
      try {
        // Use the proper Stack Auth method to handle OAuth callback
        const result = await stackClientApp.callOAuthCallback();
        
        // Check if user is now authenticated
        const user = await stackClientApp.getUser();
        console.log('User after callOAuthCallback:', user);
        
        if (user) {
          // Update our auth service using the new refresh method
          await neonAuthService.refreshAuthState();
          router.push('/');
          return;
        }
        
      } catch (callbackError) {
        console.error('callOAuthCallback error:', callbackError);
        error.value = `OAuth callback failed: ${callbackError.message}`;
      }
    } else {
      console.log('No OAuth authorization code found in URL parameters');
      console.log('Full URL:', window.location.href);
      console.log('Route query:', route.query);
      console.log('Search params:', window.location.search);
      
      error.value = 'No OAuth authorization code received. This usually means the OAuth provider redirect is not configured correctly.';
      
      // Add more specific error message for debugging
      const callbackUrl = `${window.location.protocol}//${window.location.host}/handler/oauth-callback`;
      error.value += `\n\nExpected callback URL: ${callbackUrl}`;
      error.value += '\n\nPlease ensure this URL is configured in your Stack Auth dashboard under OAuth providers.';
    }
    
    // If we get here without success, show error
    if (!error.value) {
      error.value = 'OAuth authentication flow did not complete successfully. Please try again.';
    }
    
  } catch (err) {
    console.error('OAuth callback error:', err);
    error.value = `An error occurred during authentication: ${err.message}`;
    debugInfo.value = {
      ...debugInfo.value,
      error: err.message,
      stack: err.stack
    };
  }
});

function redirectToHome() {
  router.push('/');
}

function retryAuth() {
  // Clear any existing auth state and redirect to home to try again
  stackClientApp.signOut().catch(console.error);
  router.push('/');
}
</script>
