<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-blue-400">Google Sheets</span>
            <span class=""> - Connection Setup</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="resetModal" 
              class="px-2 py-1 sm:px-3 bg-gray-600 hover:bg-gray-500 text-xs sm:text-sm text-white rounded-md"
            >
              Reset
            </button>
            <button 
              @click="closeModal"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Description Area -->
      <div class="p-3 bg-gray-750/60 border-b border-gray-700">
        <div class="space-y-1">
          <p class="text-xs text-gray-300">
            Connect your Google Sheet for TR tracking. Follow the steps to set up your tracking spreadsheet.
          </p>
        </div>
      </div>

      <!-- Step Indicator -->
      <div class="p-3 border-b border-gray-700">
        <div class="flex items-center justify-center">
          <div class="flex items-center">
            <div 
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              :class="currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'"
            >
              1
            </div>
            <div class="w-8 h-0.5 bg-gray-600 mx-1" :class="currentStep >= 2 ? 'bg-blue-600' : ''"></div>
            <div 
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              :class="currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'"
            >
              2
            </div>
            <div class="w-8 h-0.5 bg-gray-600 mx-1" :class="currentStep >= 3 ? 'bg-blue-600' : ''"></div>
            <div 
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              :class="currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'"
            >
              3
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="isConnecting" class="p-6 flex flex-col items-center justify-center">
        <div class="relative">
          <div class="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <div class="absolute inset-0 w-12 h-12 border-2 border-blue-500/30 rounded-full animate-pulse"></div>
        </div>
        <p class="text-gray-400 text-sm text-center">Testing connection...</p>
        <div class="flex justify-center mt-3 space-x-2">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay:0.1s"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay:0.2s"></div>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="p-3">
        <!-- Step 1: Template Instructions -->
        <div v-if="currentStep === 1">
          <!-- Category Header -->
          <div class="flex items-center mb-3">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-blue-200">Step 1: Get the Template</h3>
          </div>

          <div class="space-y-3 mb-4">
            <!-- Template Info -->
            <div class="border border-gray-700 rounded-md p-3 bg-gray-750/30">
              <div class="flex items-start">
                <IconInfoCircle size="16" class="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 class="text-xs font-medium text-white mb-1">Template Features</h4>
                  <ul class="text-xs text-gray-300 space-y-0.5">
                    <li>• Pre-configured resource columns (Cells, MP, Shards, RP, etc.)</li>
                    <li>• Automatic calculations for gains and progress</li>
                    <li>• Goals tracking system with built-in Apps Script</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="https://docs.google.com/spreadsheets/d/111rAV1pLVp9gpITf1ACOS0kGX0wf6V38CW9EraDzhZk/copy"
                target="_blank"
                class="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs transition-colors"
              >
                <IconExternalLink size="14" class="mr-1.5" />
                Open Template & Copy
              </a>
              
              <button
                @click="currentStep = 2"
                class="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs transition-colors"
              >
                <IconArrowRight size="14" class="mr-1.5" />
                I've Copied It
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Apps Script Setup -->
        <div v-if="currentStep === 2">
          <!-- Category Header -->
          <div class="flex items-center mb-3">
            <div class="w-1.5 h-5 bg-green-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-green-200">Step 2: Deploy Apps Script</h3>
          </div>

          <div class="space-y-2 mb-4">
            <!-- Step Items -->
            <div class="border border-gray-700 rounded-md p-2 hover:bg-gray-700/30">
              <div class="flex items-start">
                <div class="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</div>
                <div>
                  <h4 class="text-xs font-medium text-white">Open Apps Script</h4>
                  <p class="text-xs text-gray-400">Go to Extensions → Apps Script in your copied sheet</p>
                </div>
              </div>
            </div>

            <div class="border border-gray-700 rounded-md p-2 hover:bg-gray-700/30">
              <div class="flex items-start">
                <div class="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</div>
                <div>
                  <h4 class="text-xs font-medium text-white">Deploy as Web App</h4>
                  <p class="text-xs text-gray-400">Click Deploy → New Deployment</p>
                </div>
              </div>
            </div>

            <div class="border border-gray-700 rounded-md p-2 hover:bg-gray-700/30">
              <div class="flex items-start">
                <div class="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</div>
                <div>
                  <h4 class="text-xs font-medium text-white">Configure Access</h4>
                  <p class="text-xs text-gray-400">Execute as: Me (your email) | Who has access: Anyone</p>
                </div>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <!-- Security Warning Info -->
              <div class="border border-amber-500/30 bg-amber-900/20 rounded-md p-3">
                <div class="flex items-start">
                  <IconShield size="16" class="text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 class="text-xs font-medium text-amber-400 mb-1">Privacy & Security</h4>
                    <ul class="text-xs text-amber-300/90 space-y-0.5">
                      <li>• Your data stays in YOUR Google account only</li>
                      <li>• No data is sent to external servers</li>
                      <li>• Script only accesses YOUR spreadsheet</li>
                      <li>• Google warning is normal for custom scripts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Step with Warning Handling -->
              <div class="border border-gray-700 rounded-md p-2">
                <h4 class="text-xs font-medium text-white mb-2">When you see the Google security warning:</h4>
                <div class="space-y-1 text-xs text-gray-400">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-blue-600 rounded-full mr-2 flex-shrink-0"></div>
                    Click "Advanced" at the bottom
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-blue-600 rounded-full mr-2 flex-shrink-0"></div>
                    Click "Go to [Your Project] (unsafe)"
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-600 rounded-full mr-2 flex-shrink-0"></div>
                    Click "Allow" - your data stays private!
                  </div>
                </div>
              </div>
            </div>

            <div class="border border-gray-700 rounded-md p-2 hover:bg-gray-700/30">
              <div class="flex items-start">
                <div class="w-4 h-4 rounded-full bg-green-600 text-white text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</div>
                <div>
                  <h4 class="text-xs font-medium text-white">Copy Web App URL</h4>
                  <p class="text-xs text-gray-400">Copy the Web App URL (ends with /exec)</p>
                </div>
              </div>
            </div>
          </div>


          <!-- Navigation -->
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="currentStep = 1"
              class="flex items-center justify-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs transition-colors"
            >
              <IconArrowLeft size="14" class="mr-1.5" />
              Back
            </button>
            
            <button
              @click="currentStep = 3"
              class="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs transition-colors"
            >
              <IconArrowRight size="14" class="mr-1.5" />
              I've Got the URL
            </button>
          </div>
        </div>

        <!-- Step 3: Enter URL and Test -->
        <div v-if="currentStep === 3">
          <!-- Category Header -->
          <div class="flex items-center mb-3">
            <div class="w-1.5 h-5 bg-amber-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-amber-200">Step 3: Connect Your Sheet</h3>
          </div>

          <div class="space-y-3 mb-4">
            <!-- URL Input -->
            <div class="border border-gray-700 rounded-md p-2 hover:bg-gray-700/30">
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <div class="flex-1 mr-2">
                    <div class="text-xs font-medium text-gray-200">Google Apps Script Web App URL</div>
                  </div>
                </div>
                <div class="flex gap-1">
                  <input
                    v-model="sheetUrl"
                    type="url"
                    placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
                    class="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    :class="{ 'border-red-500': urlError }"
                  />
                  <button
                    @click="testConnection"
                    :disabled="isConnecting || !sheetUrl"
                    class="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-xs"
                  >
                    <IconRefresh 
                      size="12" 
                      :class="{ 'animate-spin': isConnecting }"
                    />
                  </button>
                </div>
                <p v-if="urlError" class="text-red-400 text-xs">{{ urlError }}</p>
              </div>
            </div>

            <!-- Connection Status -->
            <div v-if="connectionStatus" class="border rounded-md p-2"
              :class="connectionStatus.success 
                ? 'border-green-500/30 bg-green-900/20' 
                : 'border-red-500/30 bg-red-900/20'"
            >
              <div class="flex items-start">
                <IconCheck v-if="connectionStatus.success" size="14" class="text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <IconAlertCircle v-else size="14" class="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 class="text-xs font-medium" :class="connectionStatus.success ? 'text-green-400' : 'text-red-400'">
                    {{ connectionStatus.success ? 'Connection Successful!' : 'Connection Failed' }}
                  </h4>
                  <p class="text-xs opacity-90" :class="connectionStatus.success ? 'text-green-300' : 'text-red-300'">
                    {{ connectionStatus.message }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Sheet Info -->
            <div v-if="sheetInfo" class="border border-gray-700 rounded-md p-2 bg-gray-750/30">
              <h4 class="text-xs font-medium text-white mb-2">Sheet Information</h4>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-400">Name:</span>
                  <span class="text-white">{{ sheetInfo.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Sheets:</span>
                  <span class="text-white">{{ sheetInfo.sheetCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Plans:</span>
                  <span class="text-white">{{ sheetInfo.trackingPlans }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Status:</span>
                  <span class="text-green-400">Connected</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="currentStep = 2"
              class="flex items-center justify-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs transition-colors"
            >
              <IconArrowLeft size="14" class="mr-1.5" />
              Back
            </button>
            
            <button
              @click="saveConnection"
              :disabled="!connectionStatus?.success"
              class="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md text-xs transition-colors"
            >
              <IconCheck size="14" class="mr-1.5" />
              Save Connection
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <div class="text-xs text-gray-300">
            Step {{ currentStep }} of 3 - {{ currentStep === 1 ? 'Get Template' : currentStep === 2 ? 'Deploy Script' : 'Connect Sheet' }}
          </div>
          <div class="flex space-x-2">
            <button 
              @click="closeModal"
              class="px-2 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { 
  IconX, 
  IconInfoCircle, 
  IconExternalLink, 
  IconArrowRight, 
  IconArrowLeft,
  IconRefresh,
  IconCheck,
  IconAlertCircle
} from '@tabler/icons-vue';

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close', 'connected']);

// Store
const trackingStore = useTRTrackingStore();

// Reactive state
const currentStep = ref(1);
const sheetUrl = ref('');
const urlError = ref('');
const isConnecting = ref(false);
const connectionStatus = ref(null);
const sheetInfo = ref(null);

// Watch for modal close/open
watch(() => props.show, (show) => {
  if (show) {
    resetModal();
  }
});

// Methods
function resetModal() {
  currentStep.value = 1;
  sheetUrl.value = '';
  urlError.value = '';
  connectionStatus.value = null;
  sheetInfo.value = null;
  isConnecting.value = false;
}

function closeModal() {
  emit('close');
}

function validateUrl(url) {
  if (!url) return 'Please enter a URL';
  if (!url.includes('script.google.com')) return 'Must be a Google Apps Script URL';
  if (!url.includes('/exec')) return 'URL must end with /exec';
  return null;
}

async function testConnection() {
  urlError.value = '';
  connectionStatus.value = null;
  sheetInfo.value = null;
  
  // Validate URL
  const error = validateUrl(sheetUrl.value);
  if (error) {
    urlError.value = error;
    return;
  }
  
  isConnecting.value = true;
  
  try {
    // Try CORS first, fallback to JSONP
    let data;
    
    try {
      // CORS attempt
      const response = await fetch(sheetUrl.value + '?action=validateConnection', {
        method: 'GET',
        mode: 'cors'
      });
      
      if (response.ok) {
        data = await response.json();
      } else {
        throw new Error('CORS failed, trying JSONP...');
      }
    } catch (corsError) {
      console.log('CORS failed, using JSONP fallback');
      
      // JSONP fallback
      data = await fetchWithJSONP(sheetUrl.value + '?action=validateConnection');
    }
    
    if (data.success && data.data.connected) {
      connectionStatus.value = {
        success: true,
        message: 'Successfully connected to your Google Sheet!'
      };
      
      sheetInfo.value = {
        name: data.data.spreadsheetName || 'Unknown',
        sheetCount: data.data.sheetCount || 0,
        trackingPlans: data.data.traversalSheets || 0
      };
    } else {
      throw new Error(data.error || 'Connection failed');
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    connectionStatus.value = {
      success: false,
      message: error.message.includes('CORS') 
        ? 'CORS error: Please check your Apps Script deployment settings'
        : error.message
    };
  } finally {
    isConnecting.value = false;
  }
}

/**
 * JSONP fallback for CORS issues
 */
function fetchWithJSONP(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_callback_' + Date.now();
    const script = document.createElement('script');
    
    // Set up callback
    window[callbackName] = function(data) {
      resolve(data);
      document.head.removeChild(script);
      delete window[callbackName];
    };
    
    // Handle errors
    script.onerror = function() {
      reject(new Error('JSONP request failed'));
      document.head.removeChild(script);
      delete window[callbackName];
    };
    
    // Create request
    script.src = url + (url.includes('?') ? '&' : '?') + 'callback=' + callbackName;
    document.head.appendChild(script);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (window[callbackName]) {
        reject(new Error('JSONP request timeout'));
        document.head.removeChild(script);
        delete window[callbackName];
      }
    }, 10000);
  });
}

function saveConnection() {
  if (!connectionStatus.value?.success) return;
  
  // Save to store
  const connectionData = {
    url: sheetUrl.value,
    sheetInfo: sheetInfo.value,
    connectedAt: new Date().toISOString()
  };
  
  // Call store method to save connection
  trackingStore.connectSheet(connectionData);
  
  emit('connected', connectionData);
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

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}
</style>