<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Stack Auth Debug Interface</h1>
      
      <!-- Configuration Status -->
      <div class="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 class="text-lg font-semibold mb-3">Configuration Status</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-400">Project ID:</span>
            <span class="ml-2" :class="config.projectId ? 'text-green-400' : 'text-red-400'">
              {{ config.projectId || 'Missing' }}
            </span>
          </div>
          <div>
            <span class="text-gray-400">Publishable Key:</span>
            <span class="ml-2" :class="config.hasPublishableKey ? 'text-green-400' : 'text-red-400'">
              {{ config.hasPublishableKey ? 'Present' : 'Missing' }}
            </span>
          </div>
          <div>
            <span class="text-gray-400">Base URL:</span>
            <span class="ml-2">{{ config.baseUrl || 'Default' }}</span>
          </div>
          <div>
            <span class="text-gray-400">Current URL:</span>
            <span class="ml-2">{{ config.currentUrl }}</span>
          </div>
        </div>
      </div>

      <!-- Expected Callback URLs -->
      <div class="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 class="text-lg font-semibold mb-3">Expected OAuth Callback URLs</h2>
        <div class="space-y-2 text-sm">
          <div v-for="url in callbackUrls" :key="url" class="font-mono text-blue-300">
            {{ url }}
          </div>
        </div>
        <p class="text-gray-400 text-xs mt-3">
          These URLs must be configured in your Stack Auth dashboard for each OAuth provider (Google, GitHub).
        </p>
      </div>

      <!-- Test Buttons -->
      <div class="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 class="text-lg font-semibold mb-3">Test OAuth</h2>
        <div class="space-x-4">
          <button 
            @click="testGoogleOAuth"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded transition-colors"
          >
            {{ loading ? 'Testing...' : 'Test Google OAuth' }}
          </button>
          <button 
            @click="testGitHubOAuth"
            :disabled="loading"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded transition-colors"
          >
            {{ loading ? 'Testing...' : 'Test GitHub OAuth' }}
          </button>
          <button 
            @click="testConnection"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded transition-colors"
          >
            Test Connection
          </button>
        </div>
      </div>

      <!-- Current User -->
      <div class="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 class="text-lg font-semibold mb-3">Current User</h2>
        <div v-if="currentUser" class="text-sm">
          <pre class="bg-gray-900 p-3 rounded text-green-400">{{ JSON.stringify(currentUser, null, 2) }}</pre>
        </div>
        <div v-else class="text-gray-400">Not authenticated</div>
      </div>

      <!-- Error Log -->
      <div v-if="errors.length > 0" class="bg-red-900/20 border border-red-600 rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-3 text-red-400">Error Log</h2>
        <div class="space-y-2">
          <div v-for="(error, index) in errors" :key="index" class="text-sm text-red-300">
            <span class="text-gray-400">{{ error.timestamp }}:</span> {{ error.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { stackClientApp } from '@/services/stackAuth';
import { neonAuthService } from '@/services/neonAuthService';

const config = ref({});
const callbackUrls = ref([]);
const currentUser = ref(null);
const loading = ref(false);
const errors = ref([]);

function addError(message) {
  errors.value.push({
    timestamp: new Date().toLocaleTimeString(),
    message
  });
}

onMounted(async () => {
  // Load configuration
  config.value = {
    projectId: import.meta.env.VITE_STACK_PROJECT_ID,
    hasPublishableKey: !!import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
    baseUrl: import.meta.env.VITE_STACK_BASE_URL,
    currentUrl: window.location.href
  };

  // Generate callback URLs
  const domain = `${window.location.protocol}//${window.location.host}`;
  callbackUrls.value = [
    `${domain}/handler/oauth-callback`,
    'http://localhost:8888/handler/oauth-callback',
    'http://localhost:5174/handler/oauth-callback',
    'https://cifi-tools.com/handler/oauth-callback'
  ];

  // Check current user
  try {
    currentUser.value = await stackClientApp.getUser();
  } catch (error) {
    addError(`Failed to get current user: ${error.message}`);
  }
});

async function testConnection() {
  loading.value = true;
  try {
    console.log('Testing Stack Auth connection...');
    const user = await stackClientApp.getUser();
    console.log('Connection test successful, current user:', user);
    addError('Connection test successful');
  } catch (error) {
    console.error('Connection test failed:', error);
    addError(`Connection test failed: ${error.message}`);
  } finally {
    loading.value = false;
  }
}

async function testGoogleOAuth() {
  loading.value = true;
  try {
    console.log('Testing Google OAuth redirect...');
    await neonAuthService.signInWithGoogle();
  } catch (error) {
    console.error('Google OAuth test failed:', error);
    addError(`Google OAuth failed: ${error.message}`);
  } finally {
    loading.value = false;
  }
}

async function testGitHubOAuth() {
  loading.value = true;
  try {
    console.log('Testing GitHub OAuth redirect...');
    await neonAuthService.signInWithGitHub();
  } catch (error) {
    console.error('GitHub OAuth test failed:', error);
    addError(`GitHub OAuth failed: ${error.message}`);
  } finally {
    loading.value = false;
  }
}
</script>
