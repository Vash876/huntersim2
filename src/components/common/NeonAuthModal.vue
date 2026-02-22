<template>
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4">
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Sign In
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

      <!-- Content -->
      <div class="p-5">
        <p class="text-gray-400 text-sm mb-4 text-center">
          Sign in to sync your data across devices
        </p>

        <!-- Error -->
        <div v-if="error" class="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
          <p class="text-red-300 text-sm">{{ error }}</p>
        </div>

        <!-- Google Sign-In Button -->
        <button
          @click="handleGoogleSignIn"
          :disabled="loading"
          class="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ loading ? 'Signing in...' : 'Continue with Google' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { neonAuthService } from '@/services/neonAuthService'

export default {
  name: 'NeonAuthModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const showModal = ref(props.show)
    const loading = ref(false)
    const error = ref('')

    const closeModal = () => {
      showModal.value = false
      error.value = ''
      emit('close')
    }

    const handleGoogleSignIn = async () => {
      if (loading.value) return

      loading.value = true
      error.value = ''

      try {
        const user = await neonAuthService.signInWithGoogle()
        if (user) {
          emit('success', 'signin')
          closeModal()
        }
      } catch (err) {
        error.value = err.message || 'Google sign in failed'
      } finally {
        loading.value = false
      }
    }

    watch(() => props.show, (newVal) => {
      showModal.value = newVal
      if (newVal) {
        error.value = ''
      }
    })

    return {
      showModal,
      loading,
      error,
      closeModal,
      handleGoogleSignIn
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
