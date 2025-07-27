<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4">
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          🔧 OAuth Debug Test
        </h2>
        <button 
          @click="closeModal"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-5">
        
        <!-- Stack Auth Info -->
        <div class="mb-4 p-3 bg-gray-700/50 rounded-lg">
          <h3 class="text-sm font-semibold text-white mb-2">Stack Auth Status</h3>
          <div class="text-xs space-y-1">
            <div>Project ID: <span class="text-green-400">{{ config.projectId || 'Missing' }}</span></div>
            <div>Key Present: <span :class="config.hasKey ? 'text-green-400' : 'text-red-400'">{{ config.hasKey ? 'Yes' : 'No' }}</span></div>
            <div>Current URL: <span class="text-blue-400">{{ config.currentUrl }}</span></div>
          </div>
        </div>

        <!-- OAuth Method Testing -->
        <div class="space-y-3 mb-4">
          <h3 class="text-sm font-semibold text-white">Test OAuth Methods</h3>
          
          <button
            @click="testMethod('signInWithOAuth', 'google')"
            :disabled="loading"
            class="w-full p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded text-sm transition-colors"
          >
            Test: stackClientApp.signInWithOAuth('google')
          </button>
          
          <button
            @click="testMethod('redirectToOAuth', 'google')"
            :disabled="loading"
            class="w-full p-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded text-sm transition-colors"
          >
            Test: stackClientApp.redirectToOAuth('google')
          </button>
          
          <button
            @click="testMethod('signInWithProvider', 'google')"
            :disabled="loading"
            class="w-full p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded text-sm transition-colors"
          >
            Test: stackClientApp.signInWithProvider('google')
          </button>

          <button
            @click="inspectStackAuth"
            :disabled="loading"
            class="w-full p-2 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 rounded text-sm transition-colors"
          >
            Inspect Stack Auth Object
          </button>
        </div>

        <!-- Results -->
        <div v-if="results.length > 0" class="mb-4">
          <h3 class="text-sm font-semibold text-white mb-2">Test Results</h3>
          <div class="max-h-40 overflow-y-auto space-y-2">
            <div 
              v-for="(result, index) in results" 
              :key="index"
              class="text-xs p-2 rounded"
              :class="{
                'bg-green-900/30 text-green-300': result.type === 'success',
                'bg-red-900/30 text-red-300': result.type === 'error',
                'bg-blue-900/30 text-blue-300': result.type === 'info'
              }"
            >
              <div class="font-mono text-gray-400">{{ result.timestamp }}</div>
              <div>{{ result.message }}</div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-2">
          <button
            @click="clearResults"
            class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
          >
            Clear Results
          </button>
          <button
            @click="closeModal"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { stackClientApp } from '@/services/stackAuth';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const loading = ref(false);
const config = ref({});
const results = ref([]);

onMounted(() => {
  config.value = {
    projectId: import.meta.env.VITE_STACK_PROJECT_ID,
    hasKey: !!import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
    currentUrl: window.location.href
  };
});

function addResult(message, type = 'info') {
  results.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    message,
    type
  });
}

function closeModal() {
  emit('close');
}

function clearResults() {
  results.value = [];
}

async function testMethod(methodName, provider) {
  loading.value = true;
  
  try {
    addResult(`Testing ${methodName}('${provider}')...`, 'info');
    
    if (!stackClientApp[methodName]) {
      addResult(`Method ${methodName} not available on stackClientApp`, 'error');
      return;
    }
    
    console.log(`Calling stackClientApp.${methodName}('${provider}')...`);
    
    const result = await stackClientApp[methodName](provider);
    
    addResult(`${methodName} completed. Result: ${JSON.stringify(result)}`, 'success');
    console.log(`${methodName} result:`, result);
    
    // Check if we should have been redirected
    if (!result || typeof result === 'undefined') {
      addResult('Method completed but no redirect occurred. This might indicate a configuration issue.', 'error');
    }
    
  } catch (error) {
    addResult(`${methodName} failed: ${error.message}`, 'error');
    console.error(`${methodName} error:`, error);
  } finally {
    loading.value = false;
  }
}

function inspectStackAuth() {
  console.log('Stack Auth Object:', stackClientApp);
  
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(stackClientApp))
    .filter(name => name.includes('OAuth') || name.includes('signIn') || name.includes('redirect'));
  
  addResult(`Available OAuth methods: ${methods.join(', ')}`, 'info');
  
  const options = stackClientApp._options || {};
  addResult(`Stack Auth options: ${JSON.stringify(options, null, 2)}`, 'info');
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
