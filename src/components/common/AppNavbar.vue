<template>
  <header class="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg relative z-50">
    <!-- Dekorativer Farbverlauf an der Oberseite -->
    <div class="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    
    <!-- Desktop Navigation -->
    <div class="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
      <!-- Logo & Branding -->
      <router-link to="/" class="flex items-center group no-underline hover:opacity-90 transition-opacity">
        <div class="mr-3 bg-gradient-to-br from-blue-400 to-purple-600 p-2 rounded-lg shadow-glow transition-all duration-300">
          <IconTargetArrow size="24" class="text-white" />
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-bold tracking-wide text-white">Hunter Simulator</span>
          <span class="text-xs text-gray-400">by Kylenator and Vash</span>
        </div>
      </router-link>
      
      <!-- Navigation Links -->
      <nav class="flex items-center">
        <!-- Hunters Gruppe -->
        <div class="bg-gray-800/90 rounded-xl p-1 flex mr-2">
          <router-link 
            v-for="hunter in navigation.hunters" 
            :key="hunter.id"
            :to="hunter.path"
            class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center mx-0.5 hover:bg-gray-750"
            :class="[$route.path.startsWith(hunter.path) ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-300 hover:text-white']"
          >
            <component :is="hunter.icon" class="w-5 h-5 mr-1.5" />
            <span>{{ hunter.name }}</span>
          </router-link>
          <!-- Upgrades Button -->
          <div class="relative mx-0.5">
            <button 
              class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center hover:bg-gray-750"
              :class="[activeCategory === 'Upgrades' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-300 hover:text-white']"
              @click="toggleCategory('Upgrades')"
            >
              <IconArrowUpCircle size="18" class="mr-1.5" />
              <span>Upgrades</span>
              <IconChevronDown 
                size="16" 
                class="ml-1.5 transition-transform duration-200"
                :class="{'rotate-180': activeCategory === 'Upgrades'}"
              />
            </button>
            
            <!-- Upgrades Mega Menu (Dropdown) -->
            <div 
              class="absolute top-full right-0 mt-2 bg-gray-800 rounded-xl shadow-xl transform transition-all duration-200 origin-top-right z-50 border border-gray-700 w-[600px] overflow-hidden" 
              :class="activeCategory === 'Upgrades' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
            >                
              <div class="p-4">
                <div class="grid grid-cols-3 gap-6">
                  <div v-for="(category, index) in navigation.upgradeCategories" :key="index" class="space-y-1">
                    <h3 class="text-sm font-bold text-gray-300 mb-2 px-2 flex items-center">
                      <span class="h-4 w-1 rounded-r bg-blue-500 mr-2"></span>
                      {{ category.name }}
                    </h3>
                    <router-link 
                      v-for="(link, linkIndex) in category.links" 
                      :key="linkIndex" 
                      :to="link.path"
                      class="flex items-center px-3 py-1.5 rounded-lg transition-colors duration-200"
                      :class="[$route.path === link.path ? 'bg-blue-900/30 text-blue-200' : 'hover:bg-gray-700/50 text-gray-300 hover:text-white']"
                      @click="activeCategory = null"
                    >
                      <component :is="link.icon" class="w-4 h-4 mr-2 text-gray-400" />
                      <span class="text-sm">{{ link.label }}</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 

        <div class="bg-gray-800/90 rounded-xl p-1 mr-2 flex items-center">
          <!-- Tools Button -->
          <div class="relative mx-0.5">
            <button 
              class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center hover:bg-gray-750"
              :class="[activeCategory === 'Tools' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-300 hover:text-white']"
              @click="toggleCategory('Tools')"
            >
              <IconTools size="18" class="mr-1.5" />
              <span>Tools</span>
              <IconChevronDown 
                size="16" 
                class="ml-1.5 transition-transform duration-200"
                :class="{'rotate-180': activeCategory === 'Tools'}"
              />
            </button>
            
            <!-- Tools Dropdown Menu -->
            <div 
              class="absolute top-full right-0 mt-2 bg-gray-800 rounded-xl shadow-xl transform transition-all duration-200 origin-top-right z-50 border border-gray-700 w-64" 
              :class="activeCategory === 'Tools' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
            >              
              <div class="py-2">
                <router-link 
                  v-for="tool in navigation.tools" 
                  :key="tool.id"
                  :to="tool.path" 
                  class="flex items-center px-4 py-2.5 transition-colors duration-200"
                  :class="[$route.path === tool.path ? 'bg-blue-900/30 text-blue-200' : 'hover:bg-gray-700/50 text-gray-300 hover:text-white']"
                  @click="activeCategory = null"
                >
                  <div class="p-1.5 rounded bg-gray-750 mr-3 flex items-center justify-center">
                    <component :is="tool.icon" class="w-5 h-5 text-blue-400" />
                  </div>
                  <span class="font-medium">{{ tool.name }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/90 rounded-xl p-1 flex items-center">
          
          <!-- Settings Link -->
          <router-link 
            to="/settings" 
            class="px-3 py-1.5 rounded-lg transition-colors duration-200 mx-0.5 flex items-center hover:bg-gray-750"
            :class="[$route.path === '/settings' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-300 hover:text-white']"
          >
            <IconSettings size="18" class="mr-1.5" />
            <span>Settings</span>
          </router-link>

          <!-- Buymeacoffee Link -->
          <a 
            href="https://buymeacoffee.com/VashCifi" 
            target="_blank" 
            rel="noopener noreferrer"
            class="px-3 py-1.5 rounded-lg transition-colors duration-200 mx-0.5 flex items-center hover:bg-amber-700/20"
            title="Buy me a coffee"
          >
            <IconCoffee size="18" class="mr-1.5" />
          </a>
        </div>
      </nav>
    </div>
    
    <!-- Click outside backdrop für Dropdowns -->
    <div 
      v-if="activeCategory !== null" 
      class="fixed inset-0 z-40 bg-transparent"
      @click="activeCategory = null"
    ></div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { NAVIGATION } from '../../constants/navigation';
import { useRoute } from 'vue-router';
import { 
  IconTargetArrow, 
  IconChevronDown, 
  IconArrowUpCircle,
  IconSettings,
  IconCoffee,
  IconTools,
  IconSearch
} from '@tabler/icons-vue';

const navigation = NAVIGATION;
const route = useRoute();

// Desktop menu state
const activeCategory = ref(null);

// Toggle category function
function toggleCategory(category) {
  if (activeCategory.value === category) {
    activeCategory.value = null;
  } else {
    activeCategory.value = category;
  }
}
</script>

<style scoped>
/* Glow-Effekt für das Logo */
.shadow-glow {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
}

/* Spezifische Hintergrundfarbe zwischen gray-700 und gray-800 */
.bg-gray-750 {
  background-color: rgba(40, 44, 52, 1);
}

/* Verbesserte Hover-Effekte für alle Links und Buttons */
button, a {
  transition: all 0.2s ease;
}

/* Hover-Effekte für alle Navigationslinks */
.rounded-lg:hover {
  background-color: rgb(55, 65, 81, 1);
}

/* Hover-Effekt für Links im Dropdown */
.rounded-lg:hover .text-gray-300 {
  color: white;
}

/* Keine Unterstreichung für Router-Links */
a {
  text-decoration: none;
}

/* Effekt für aktive Links */
.bg-gray-700 {
  background-color: rgba(55, 65, 81, 1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Animation für das Support-Label */
.opacity-0.max-w-0:hover {
  opacity: 1;
  max-width: 80px;
}
</style>