<template>
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4">
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header mit Schließen-Button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          {{ mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Reset Password' }}
        </h2>
        <button 
          @click="closeModal"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal-Inhalt -->
      <div class="p-5">
        <!-- OAuth Buttons (only for signin/signup) -->
        <div v-if="mode !== 'reset'" class="space-y-3 mb-6">
          <button
            @click="handleOAuthSignIn('google')"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            @click="handleOAuthSignIn('github')"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-2 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-800 text-gray-400">or</span>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your.email@example.com"
            />
          </div>

          <!-- Password Field (not for reset) -->
          <div v-if="mode !== 'reset'">
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <!-- Name Field (only for signup) -->
          <div v-if="mode === 'signup'">
            <label for="name" class="block text-sm font-medium text-gray-300 mb-1">
              Name (optional)
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Name"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-red-400 text-sm bg-red-900/30 p-3 rounded-lg border border-red-800/50">
            {{ error }}
          </div>

          <!-- Success Message -->
          <div v-if="success" class="text-green-400 text-sm bg-green-900/30 p-3 rounded-lg border border-green-800/50">
            {{ success }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>
              {{ mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Reset Password' }}
            </span>
          </button>
        </form>

        <!-- Mode Switch Links -->
        <div class="mt-6 text-center text-sm">
          <template v-if="mode === 'signin'">
            <p class="text-gray-400">
              Don't have an account?
              <button @click="switchMode('signup')" class="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Sign up
              </button>
            </p>
            <p class="text-gray-400 mt-2">
              Forgot your password?
              <button @click="switchMode('reset')" class="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Reset it
              </button>
            </p>
          </template>
          
          <template v-else-if="mode === 'signup'">
            <p class="text-gray-400">
              Already have an account?
              <button @click="switchMode('signin')" class="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Sign in
              </button>
            </p>
          </template>
          
          <template v-else>
            <p class="text-gray-400">
              Remember your password?
              <button @click="switchMode('signin')" class="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Sign in
              </button>
            </p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { neonAuthService } from '@/services/neonAuthService'

export default {
  name: 'NeonAuthModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    initialMode: {
      type: String,
      default: 'signin',
      validator: value => ['signin', 'signup', 'reset'].includes(value)
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const showModal = ref(props.show)
    const mode = ref(props.initialMode)
    const loading = ref(false)
    const error = ref('')
    const success = ref('')

    const form = reactive({
      email: '',
      password: '',
      name: ''
    })

    const closeModal = () => {
      showModal.value = false
      emit('close')
      resetForm()
    }

    const resetForm = () => {
      form.email = ''
      form.password = ''
      form.name = ''
      error.value = ''
      success.value = ''
      loading.value = false
    }

    const switchMode = (newMode) => {
      mode.value = newMode
      error.value = ''
      success.value = ''
    }

    const handleSubmit = async () => {
      if (loading.value) return

      loading.value = true
      error.value = ''
      success.value = ''

      try {
        if (mode.value === 'signin') {
          await neonAuthService.signIn(form.email, form.password)
          success.value = 'Sign in successful!'
          setTimeout(() => {
            emit('success', 'signin')
            closeModal()
          }, 1000)
        } 
        else if (mode.value === 'signup') {
          await neonAuthService.signUp(form.email, form.password, form.name)
          success.value = 'Account created successfully!'
          setTimeout(() => {
            emit('success', 'signup')
            closeModal()
          }, 1000)
        }
        else if (mode.value === 'reset') {
          await neonAuthService.resetPassword(form.email)
          success.value = 'Password reset email sent!'
          setTimeout(() => {
            switchMode('signin')
          }, 2000)
        }
      } catch (err) {
        error.value = err.message || 'An error occurred'
      } finally {
        loading.value = false
      }
    }

    const handleOAuthSignIn = async (provider) => {
      if (loading.value) return

      loading.value = true
      error.value = ''
      success.value = ''

      try {
        let user
        if (provider === 'google') {
          user = await neonAuthService.signInWithGoogle()
        } else if (provider === 'github') {
          user = await neonAuthService.signInWithGitHub()
        }

        if (user) {
          success.value = `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign in successful!`
          setTimeout(() => {
            emit('success', provider)
            closeModal()
          }, 1000)
        }
      } catch (err) {
        error.value = err.message || `${provider} sign in failed`
      } finally {
        loading.value = false
      }
    }

    // Watch for prop changes
    watch(() => props.show, (newVal) => {
      showModal.value = newVal
      if (newVal) {
        resetForm()
        mode.value = props.initialMode
      }
    })

    return {
      showModal,
      mode,
      loading,
      error,
      success,
      form,
      closeModal,
      switchMode,
      handleSubmit,
      handleOAuthSignIn
    }
  }
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
