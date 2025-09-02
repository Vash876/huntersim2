<!-- Modernisierte AppNavbar mit aktuellen Tailwind Best Practices -->
<template>
  <header class="
    bg-gray-900/95 backdrop-blur-md
    supports-[backdrop-filter]:bg-gray-900/80
    text-white shadow-xl 
    relative z-50 
    border-b border-gray-800/50
  ">
    <!-- Gem Level Warning mit besserer UX -->
    <div 
      v-if="showGemLevelWarning" 
      class="
        bg-gradient-to-r from-amber-600/90 to-orange-600/90
        text-white text-center py-3 px-4 
        text-sm font-medium
        relative overflow-hidden
        before:absolute before:inset-0 
        before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
        before:translate-x-[-100%] before:animate-[shimmer_2s_infinite]
      "
    >
      <div class="flex items-center justify-center gap-3 relative z-10">
        <IconInfoCircle size="18" class="text-amber-200" />
        <span>Please set your gem levels first to enable full functionality.</span>
        <router-link 
          to="/upgrades/gems" 
          class="
            inline-flex items-center gap-1 
            underline hover:no-underline
            text-amber-100 hover:text-white 
            font-semibold transition-colors
            focus-visible:outline-2 focus-visible:outline-white/50
            focus-visible:outline-offset-2 focus-visible:rounded-sm
          "
        >
          <span>Configure Gems</span>
          <IconArrowRight size="14" />
        </router-link>
      </div>
    </div>
    
    <!-- Dekorativer Farbverlauf mit Animation -->
    <div class="
      h-1 bg-gradient-to-r 
      from-blue-500 via-purple-500 to-pink-500
      relative overflow-hidden
      after:absolute after:inset-0
      after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent
      after:translate-x-[-100%] after:animate-[slide_3s_ease-in-out_infinite]
    "></div>
    
    <!-- Desktop Navigation mit verbesserter Accessibility -->
    <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <!-- Logo & Branding mit besserer Interaktion -->
      <router-link 
        to="/home" 
        class="
          flex items-center group 
          no-underline transition-all duration-300
          hover:scale-105 active:scale-95
          focus-visible:outline-2 focus-visible:outline-blue-400
          focus-visible:outline-offset-4 focus-visible:rounded-lg
        "
        aria-label="HunterSim2 Home"
      >
        <div class="
          mr-4 p-3 rounded-xl
          bg-gradient-to-br from-blue-500 to-purple-600
          shadow-lg shadow-blue-500/25
          group-hover:shadow-xl group-hover:shadow-blue-500/40
          group-hover:from-blue-400 group-hover:to-purple-500
          transition-all duration-300
          relative overflow-hidden
          before:absolute before:inset-0
          before:bg-gradient-to-br before:from-white/20 before:to-transparent
          before:opacity-0 group-hover:before:opacity-100
          before:transition-opacity
        ">
          <IconTargetArrow size="28" class="text-white relative z-10" />
        </div>
        <div class="flex flex-col">
          <span class="
            text-2xl font-bold tracking-wide text-white 
            group-hover:text-blue-100 transition-colors
            drop-shadow-lg
          ">
            CIFI Tools
          </span>
          <span class="
            text-sm text-gray-400 
            group-hover:text-gray-300 transition-colors
          ">
            Hunter Simulator & Game Tools
          </span>
        </div>
      </router-link>
      
      <!-- Navigation Links mit modernem Focus Management -->
      <nav class="flex items-center gap-3" role="navigation" aria-label="Main navigation">
        
        <!-- Gems Link - Prominent mit besserer Visual Hierarchy -->
        <div class="
          bg-gray-800/60 backdrop-blur-sm
          rounded-xl p-1.5 border border-gray-700/50
          hover:bg-gray-800/80 hover:border-gray-600/50
          transition-all duration-200
        ">
          <router-link 
            to="/upgrades/gems"
            class="
              px-4 py-2.5 rounded-lg 
              transition-all duration-200 
              flex items-center gap-2
              font-semibold text-sm
              focus-visible:outline-2 focus-visible:outline-purple-400
              focus-visible:outline-offset-2
              group relative overflow-hidden
            "
            :class="[
              $route.path === '/upgrades/gems' 
                ? 'bg-purple-700 text-white shadow-lg shadow-purple-700/30' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            ]"
            aria-current="$route.path === '/upgrades/gems' ? 'page' : undefined"
          >
            <!-- Active indicator -->
            <div 
              v-if="$route.path === '/upgrades/gems'"
              class="
                absolute inset-0 
                bg-gradient-to-r from-purple-600/20 to-pink-600/20
                rounded-lg
              "
            ></div>
            
            <IconDiamond 
              class="w-5 h-5 relative z-10" 
              :class="$route.path === '/upgrades/gems' ? 'text-purple-200' : ''"
            />
            <span class="relative z-10">Gems</span>
            
            <!-- Hover effect -->
            <div class="
              absolute inset-0 
              bg-gradient-to-r from-transparent via-white/5 to-transparent
              translate-x-[-100%] group-hover:translate-x-[100%]
              transition-transform duration-500 ease-out
            "></div>
          </router-link>
        </div>

        <!-- Hunter Groups mit verbesserter Gruppierung -->
        <div class="hidden lg:flex items-center gap-2">
          <div class="
            bg-gray-800/40 backdrop-blur-sm
            rounded-xl p-1 border border-gray-700/30
            flex items-center gap-1
          ">
            <!-- Hunter Links hier... -->
            <router-link
              v-for="hunter in hunters"
              :key="hunter.id"
              :to="hunter.route"
              class="
                px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                flex items-center gap-1.5
                focus-visible:outline-2 focus-visible:outline-offset-2
                group relative
              "
              :class="[
                isActiveHunter(hunter.id) 
                  ? `bg-gradient-to-r ${hunter.gradient} text-white shadow-md` 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              ]"
            >
              <component :is="hunter.icon" class="w-4 h-4" />
              <span>{{ hunter.name }}</span>
            </router-link>
          </div>
        </div>

        <!-- Mobile Menu Button mit besserer Touch-Optimierung -->
        <button
          @click="toggleMobileMenu"
          class="
            lg:hidden p-2.5 rounded-lg
            bg-gray-800/60 hover:bg-gray-700/80
            border border-gray-700/50 hover:border-gray-600/50
            text-gray-300 hover:text-white
            transition-all duration-200
            focus-visible:outline-2 focus-visible:outline-blue-400
            focus-visible:outline-offset-2
            active:scale-95
          "
          aria-label="Toggle mobile menu"
          :aria-expanded="mobileMenuOpen"
        >
          <IconMenu2 v-if="!mobileMenuOpen" size="20" />
          <IconX v-else size="20" />
        </button>
        
      </nav>
    </div>

    <!-- Mobile Navigation Overlay mit besserer Animation -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-[-10px]"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-[-10px]"
    >
      <div 
        v-if="mobileMenuOpen"
        class="
          lg:hidden absolute top-full left-0 right-0
          bg-gray-900/98 backdrop-blur-md
          border-b border-gray-800/50
          shadow-2xl
        "
      >
        <nav class="px-6 py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
          <!-- Mobile nav items hier... -->
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  IconTargetArrow, IconDiamond, IconInfoCircle, 
  IconArrowRight, IconMenu2, IconX 
} from '@tabler/icons-vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

// Bessere Hunter-Konfiguration mit Type Safety
const hunters = [
  {
    id: 'borge',
    name: 'Borge',
    route: '/hunters/borge',
    icon: 'IconSword',
    gradient: 'from-red-600 to-red-700',
    color: 'red'
  },
  {
    id: 'knox', 
    name: 'Knox',
    route: '/hunters/knox',
    icon: 'IconShield',
    gradient: 'from-blue-600 to-blue-700',
    color: 'blue'
  },
  {
    id: 'ozzy',
    name: 'Ozzy', 
    route: '/hunters/ozzy',
    icon: 'IconZap',
    gradient: 'from-green-600 to-green-700',
    color: 'green'
  }
]

const showGemLevelWarning = computed(() => {
  // Ihre Logik hier
  return false
})

function isActiveHunter(hunterId) {
  return route.path.includes(hunterId)
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Schließe Mobile Menu bei Route-Wechsel
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
/* Custom Animationen */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes slide {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

/* Safari-spezifische Optimierungen */
@supports (-webkit-backdrop-filter: blur(10px)) {
  .backdrop-blur-md {
    -webkit-backdrop-filter: blur(12px);
  }
}

/* Focus Ring Optimierungen */
.focus-visible\:outline-2:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-colors,
  .transition-transform {
    transition: none;
  }
  
  .animate-[shimmer_2s_infinite],
  .animate-[slide_3s_ease-in-out_infinite] {
    animation: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: more) {
  .border-gray-700\/50 {
    border-color: rgb(156 163 175);
  }
  
  .bg-gray-800\/60 {
    background-color: rgb(31 41 55);
  }
}
</style>
