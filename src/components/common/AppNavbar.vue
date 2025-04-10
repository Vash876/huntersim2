<template>
  <header class="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg relative z-50">
    <!-- Decorative top border -->
    <div class="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>
    
    <!-- Desktop Navigation (≥md) -->
    <div class="hidden md:flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <!-- Logo & Branding -->
      <div class="flex items-center group">
        <router-link to="/">
          <div class="mr-3 bg-gradient-to-br from-blue-400 to-purple-600 p-2 rounded-lg shadow-glow transition-all duration-300 group-hover:shadow-glow-intense">
            <IconTargetArrow size="24" class="text-white" />
          </div>
        </router-link>
        <div class="flex flex-col">
          <span class="text-xl font-bold tracking-wide">Hunter Simulator</span>
          <span class="text-xs text-gray-400">by Kylenator and Vash</span>
        </div>
      </div>
      
      <!-- Main Navigation -->
      <nav class="flex space-x-1 items-center">
        <!-- Hunter Categories -->
        <div v-for="hunter in navigation.hunters" :key="hunter.id" class="relative group">
          <router-link 
            :to="hunter.path"
            class="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1"
          >
            <component :is="hunter.icon" class="w-5 h-5 text-white" />
            <span class="ml-1">{{ hunter.name }}</span>
          </router-link>
        </div>
        
        <!-- Upgrades Button with Mega Menu -->
        <div class="relative group">
          <button 
            class="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1"
            :class="{'bg-gray-750': activeCategory === 'Upgrades'}"
            @click="toggleCategory('Upgrades')"
          >
            <IconArrowUpCircle size="18" />
            <span class="ml-1">Upgrades</span>
            <IconChevronDown 
              size="16" class="ml-1 transition-transform duration-200"
              :class="{'rotate-180': activeCategory === 'Upgrades'}"
            />
          </button>
          
          <!-- Mega Menu -->
          <div 
            class="absolute top-full right-0 mt-1 bg-gray-800 rounded-lg shadow-xl transform transition-all duration-200 origin-top-right z-50 border border-gray-700 w-[600px]" 
            :class="activeCategory === 'Upgrades' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
          >
            <div class="p-4">
              <div class="grid grid-cols-3 gap-6">
                <div v-for="(category, index) in navigation.upgradeCategories" :key="index" class="space-y-1">
                  <h3 class="text-sm font-bold text-gray-300 mb-2 px-2">{{ category.name }}</h3>
                  <router-link 
                    v-for="(link, linkIndex) in category.links" 
                    :key="linkIndex" 
                    :to="link.path"
                    class="flex items-center px-2 py-1.5 hover:bg-gray-700 rounded transition-colors"
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

        <!-- Tools Dropdown
        <div class="relative group">
          <button 
            class="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1"
            :class="{'bg-gray-750': activeCategory === 'Tools'}"
            @click="toggleCategory('Tools')"
          >
            <IconTools size="18" />
            <span class="ml-1">Tools</span>
            <IconChevronDown 
              size="16" class="ml-1 transition-transform duration-200"
              :class="{'rotate-180': activeCategory === 'Tools'}"
            />
          </button>-->
          
          <!-- Tools Dropdown Menu
          <div 
            class="absolute top-full right-0 mt-1 bg-gray-800 rounded-lg shadow-xl transform transition-all duration-200 origin-top-right z-50 border border-gray-700 w-56" 
            :class="activeCategory === 'Tools' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
          >
            <div class="py-2">
              <router-link 
                v-for="tool in navigation.tools" 
                :key="tool.id"
                :to="tool.path" 
                class="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                @click="activeCategory = null"
              >
                <component :is="tool.icon" class="w-5 h-5 mr-2" />
                <span>{{ tool.name }}</span>
              </router-link>
            </div>
          </div>
        </div> -->
        
        <!-- Settings Link (Desktop) -->
        <router-link 
          to="/settings" 
          class="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center ml-2"
        >
          <IconSettings size="18" />
        </router-link>

        <!-- Buymeacoffee Link -->
        <a 
          href="https://buymeacoffee.com/VashCifi" 
          target="_blank" 
          rel="noopener noreferrer"
          class="px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors flex items-center ml-2"
          title="Buy me a coffee"
        >
          <IconCoffee size="18"/>
        </a>
      </nav>
    </div>
    
    <!-- Mobile Navigation (<md) -->
    <div class="md:hidden px-4 py-3 flex items-center justify-between">
      <!-- Mobile Logo -->
      <div class="flex items-center">
        <router-link to="/">
          <div class="mr-2 bg-gradient-to-br from-blue-400 to-purple-600 p-1.5 rounded-lg">
            <IconTargetArrow class="w-5 h-5 text-white" />
          </div>
        </router-link>
        <div>
          <span class="font-bold text-lg">Hunter Simulator</span>
        </div>
      </div>
      
      <!-- Mobile Menu Toggle -->
      <button 
        class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none"
        @click="toggleMobileMenu"
      >
        <IconMenu2 v-if="!mobileOpen" class="w-6 h-6" />
        <IconX v-else class="w-6 h-6" />
      </button>
    </div>
    
    <!-- Mobile Menu -->
    <transition name="slide-fade">
      <div v-if="mobileOpen" class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm" @click="closeMobileMenu">
        <div 
          class="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-gray-800 to-gray-900 p-5 overflow-y-auto"
          @click.stop
        >
          <div class="flex flex-col h-full">
            <!-- Mobile Menu Header -->
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center">
                <div class="mr-2 bg-gradient-to-br from-blue-400 to-purple-600 p-1.5 rounded-lg">
                  <IconTargetArrow class="w-5 h-5 text-white" />
                </div>
                <div class="font-bold text-lg">Navigation</div>
              </div>
              <button 
                class="p-1.5 rounded-lg hover:bg-gray-700 focus:outline-none"
                @click="closeMobileMenu"
              >
                <IconX class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Mobile Menu Content -->
            <div class="flex-1 overflow-y-auto">
              <!-- Hunter Section -->
              <div class="mb-6">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hunters</h3>
                
                <div v-for="hunter in navigation.hunters" :key="hunter.id" class="mb-3">
                  <router-link 
                    :to="hunter.path"
                    class="flex items-center p-2 rounded bg-gray-750 hover:bg-gray-700 transition-colors"
                    @click="closeMobileMenu"
                  >
                    <component :is="hunter.icon" class="w-5 h-5 mr-2 text-white" />
                    <span>{{ hunter.name }}</span>
                  </router-link>
                </div>
              </div>
              
              <!-- Upgrades Accordions -->
              <div class="mb-6">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Upgrades</h3>
                
                <div v-for="(category, index) in navigation.upgradeCategories" :key="index" class="mb-3">
                  <div 
                    class="flex items-center justify-between p-2 rounded bg-gray-750 cursor-pointer"
                    @click="toggleSection('upgrade_' + index)"
                  >
                    <span>{{ category.name }}</span>
                    <IconChevronDown 
                      class="w-5 h-5 transition-transform duration-200"
                      :class="{'rotate-180': openSections['upgrade_' + index]}"
                    />
                  </div>
                  
                  <div 
                    v-show="openSections['upgrade_' + index]"
                    class="mt-1 pl-2 border-l border-gray-700 py-1"
                  >
                    <router-link 
                      v-for="(link, linkIndex) in category.links" 
                      :key="linkIndex"
                      :to="link.path"
                      class="flex items-center py-2 px-3 hover:bg-gray-750 rounded transition-colors"
                      @click="closeMobileMenu"
                    >
                      <component :is="link.icon" class="w-4 h-4 mr-2 text-gray-400" />
                      <span class="text-sm">{{ link.label }}</span>
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Tools Section
              <div class="mb-6">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tools</h3>
                
                <div class="space-y-2">
                  <router-link 
                    v-for="tool in navigation.tools" 
                    :key="tool.id"
                    :to="tool.path"
                    class="flex items-center p-2 rounded bg-gray-750 hover:bg-gray-700 transition-colors"
                    @click="closeMobileMenu"
                  >
                    <component :is="tool.icon" class="w-5 h-5 mr-2 text-white" />
                    <span>{{ tool.name }}</span>
                  </router-link>
                </div>
              </div> -->
            </div>
            
            <!-- Mobile Menu Footer -->
            <div class="mt-6 pt-4 border-t border-gray-700">
              <div class="flex justify-between">                
                <router-link 
                  to="/settings"
                  class="flex items-center text-sm text-gray-400 hover:text-white"
                  @click="closeMobileMenu"
                >
                  <IconSettings class="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </router-link>

                <a 
                  href="https://buymeacoffee.com/VashCifi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="flex items-center text-sm text-gray-400 hover:text-gray-300"
                >
                  <IconCoffee class="w-4 h-4 mr-2" />
                  <span>Buy me a coffee</span>
                </a>
              </div>
              
              <div class="mt-4 text-center text-xs text-gray-500">
                by Kylenator and Vash
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Click outside backdrop for desktop dropdowns -->
    <div 
      v-if="activeCategory !== null" 
      class="fixed inset-0 z-40 bg-transparent"
      @click="activeCategory = null"
    ></div>
  </header>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { NAVIGATION } from '../../constants/navigation';
import { 
  IconTargetArrow, 
  IconChevronDown, 
  IconArrowUpCircle,
  IconMenu2,
  IconX,
  IconSettings,
  IconCoffee,
  IconTools
} from '@tabler/icons-vue';

const navigation = NAVIGATION;

// Mobile menu state
const mobileOpen = ref(false);
const openSections = reactive({});

// Desktop menu state
const activeCategory = ref(null);

// Functions
function toggleSection(section) {
  openSections[section] = !openSections[section];
}

function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value;
  
  // Wenn Menü geöffnet wird, Body-Scrolling verhindern
  if (mobileOpen.value) {
    document.body.classList.add('menu-open');
  } else {
    document.body.classList.remove('menu-open');
    // Reset open sections
    Object.keys(openSections).forEach(key => {
      openSections[key] = false;
    });
  }
}

function closeMobileMenu() {
  mobileOpen.value = false;
  document.body.classList.remove('menu-open');
  // Reset open sections
  Object.keys(openSections).forEach(key => {
    openSections[key] = false;
  });
}

function toggleCategory(category) {
  if (activeCategory.value === category) {
    activeCategory.value = null;
  } else {
    activeCategory.value = category;
  }
}

// Event-Listener für Klick außerhalb
onMounted(() => {
  // Initialisiere openSections für alle Upgrade-Kategorien
  navigation.upgradeCategories.forEach((_, index) => {
    openSections[`upgrade_${index}`] = false;
  });
});

// Cleanup beim Unmount
onUnmounted(() => {
  document.body.classList.remove('menu-open');
});
</script>

<style scoped>
/* Glow-Effekt für das Logo */
.shadow-glow {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}
.shadow-glow-intense {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
}

/* Spezifische Hintergrundfarbe zwischen gray-700 und gray-800 */
.bg-gray-750 {
  background-color: rgba(40, 44, 52, 1);
}

/* Slide-fade transition for mobile menu */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Prevent scrolling when mobile menu is open */
:deep(body.menu-open) {
  overflow: hidden;
}
</style>