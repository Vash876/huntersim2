<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-900">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <h2 class="text-xl font-semibold text-white mb-2">Signing you in...</h2>
      <p class="text-gray-400">Please wait while we complete your authentication.</p>
      
      <div v-if="error" class="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
        <p class="text-red-300">{{ error }}</p>
        <button 
          @click="redirectToHome"
          class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Continue to App
        </button>
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

onMounted(async () => {
  console.log('OAuth Callback mounted, route params:', route.query);
  console.log('Current URL:', window.location.href);
  
  try {
    // Extract OAuth code and state from URL
    const { code, state } = route.query;
    console.log('OAuth params:', { code, state });
    
    if (code) {
      // We have an OAuth code, use Stack Auth's callOAuthCallback method
      console.log('OAuth code found, calling stackClientApp.callOAuthCallback()...');
      
      try {
        // Use the proper Stack Auth method to handle OAuth callback
        const result = await stackClientApp.callOAuthCallback();
        console.log('callOAuthCallback result:', result);
        
        // Check if user is now authenticated
        const user = await stackClientApp.getUser();
        console.log('User after callOAuthCallback:', user);
        
        if (user) {
          // Update our auth service using the new refresh method
          await neonAuthService.refreshAuthState();
          console.log('OAuth sign in successful!');
          router.push('/');
          return;
        }
        
      } catch (callbackError) {
        console.error('callOAuthCallback error:', callbackError);
        error.value = `OAuth callback failed: ${callbackError.message}`;
      }
    } else {
      console.log('No OAuth code found in URL parameters');
      error.value = 'No OAuth authorization code received.';
    }
    
    // If we get here, something went wrong
    console.log('OAuth flow did not complete successfully');
    if (!error.value) {
      error.value = 'Sign in was not completed. Please try again.';
    }
    
    // Redirect to home after a delay
    setTimeout(() => {
      router.push('/');
    }, 5000);
    
  } catch (err) {
    console.error('OAuth callback error:', err);
    error.value = 'An error occurred during sign in.';
    
    // Redirect to home after a delay
    setTimeout(() => {
      router.push('/');
    }, 5000);
  }
});

function redirectToHome() {
  router.push('/');
}
</script>
