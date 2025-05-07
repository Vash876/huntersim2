<<template>
  <!-- Backdrop außerhalb der nav - nur für den Hauptinhalt -->
  <div 
    v-if="activeSection" 
    class="fixed top-0 left-0 right-0 bottom-[70px] z-30 bg-slate-900/30 backdrop-blur-[1px] transition-opacity duration-300"
    @click="activeSection = null"
  ></div>
  
  <nav class="fixed bottom-0 left-0 right-0 z-50">
    <!-- Dropdown-Menüs ÜBER der Navbar -->
    <!-- HUNTER SELECTOR -->
    <div 
      class="mobile-submenu"
      :class="{visible: activeSection === 'hunters'}"
    >
      <div class="submenu-header">
        <h3>Hunter Selection</h3>
      </div>
      <div class="grid grid-cols-3 gap-3 px-3 py-4">
        <router-link 
          v-for="hunter in hunters"
          :key="hunter.id"
          :to="`/${hunter.id}`"
          class="submenu-item"
          @click="activeSection = null"
        >
          <div class="modern-card" :class="`hunter-${hunter.color || 'blue'}`">
            <div class="card-content">
              <!-- Hunter-Bilder -->
              <img :src="hunter.image" alt="hunter.name" class="w-14 h-14 mx-auto object-contain" />
              <div class="label" :class="`text-${hunter.color || 'blue'}-200`">
                {{ hunter.name }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
      <!-- Dezenter Credit unter den Karten -->
      <div class="text-center pt-1 pb-2 border-t border-gray-800 mt-2">
        <span class="font-medium text-xs text-slate-300 mr-1">Hunter Simulator</span>
        <span class="text-[10px] text-slate-500 opacity-80 mt-0.5">
          by Kylenator and Vash
        </span>
      </div>
    </div>
    
    <!-- UPGRADES MENU - Mit allen Links aus den Kategorien -->
    <div 
      class="mobile-submenu upgrades-submenu"
      :class="{visible: activeSection === 'upgrades'}"
    >
      <div class="submenu-header">
        <h3>Upgrades</h3>
      </div>
      
      <!-- Upgrades Kategorien als moderne Tabs -->
      <div class="tab-navigation">
        <button 
          v-for="(category, index) in navigation.upgradeCategories"
          :key="index"
          class="tab-button"
          :class="{ 'active': selectedUpgradeCategory === index }"
          @click="selectedUpgradeCategory = index"
        >
          {{ category.name }}
        </button>
      </div>
      
      <!-- Links für die ausgewählte Kategorie -->
      <div class="tab-content px-3 py-4">
        <div v-for="(category, categoryIndex) in navigation.upgradeCategories" :key="categoryIndex">
          <div v-if="selectedUpgradeCategory === categoryIndex" class="grid grid-cols-2 gap-3">
            <router-link 
              v-for="(link, linkIndex) in category.links" 
              :key="linkIndex" 
              :to="link.path"
              class="submenu-item"
              @click="activeSection = null"
            >
              <div class="modern-card upgrade-card">
                <div class="card-content">
                  <component :is="link.icon" class="w-6 h-6 text-indigo-400" />
                  <div class="label">
                    {{ link.label }}
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- TOOLS MENU -->
    <div 
      class="mobile-submenu"
      :class="{visible: activeSection === 'tools'}"
    >
      <div class="submenu-header">
        <h3>Game Tools</h3>
      </div>
      <div class="grid grid-cols-2 gap-3 px-3 py-4">
        <router-link 
          v-for="tool in navigation.tools"
          :key="tool.id"
          :to="tool.path"
          class="submenu-item"
          @click="activeSection = null"
        >
          <div class="modern-card tool-card">
            <div class="card-content">
              <component :is="tool.icon" class="w-7 h-7 text-purple-400" />
              <div class="label text-purple-200">
                {{ tool.name }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    
    <!-- MISC MENU -->
    <div 
      class="mobile-submenu"
      :class="{visible: activeSection === 'misc'}"
    >
      <div class="submenu-header">
        <h3>Settings & Support</h3>
      </div>
      <div class="grid grid-cols-3 gap-3 px-3 py-4">
        <router-link 
          to="/settings"
          class="submenu-item"
          @click="activeSection = null"
        >
          <div class="modern-card settings-card">
            <div class="card-content">
              <IconSettings class="w-7 h-7 text-teal-400" />
              <div class="label text-teal-200">
                Settings
              </div>
            </div>
          </div>
        </router-link>
        
        <router-link 
          to="/"
          class="submenu-item"
          @click="activeSection = null"
        >
          <div class="modern-card changelog-card">
            <div class="card-content">
              <IconHistory class="w-7 h-7 text-blue-400" />
              <div class="label text-blue-200">
                Changelog
              </div>
            </div>
          </div>
        </router-link>
        
        <a 
          href="https://buymeacoffee.com/VashCifi" 
          target="_blank"
          rel="noopener noreferrer"
          class="submenu-item"
          @click="activeSection = null"
        >
          <div class="modern-card support-card">
            <div class="card-content">
              <IconCoffee class="w-7 h-7 text-amber-400" />
              <div class="label text-amber-200">
                Support
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
    
    <!-- Die Navbar NACH den Submenüs, damit sie immer über den Submenüs liegt -->
    <div class="bg-slate-900/95 backdrop-blur-sm border-t border-indigo-500/30 shadow-lg">
      <!-- Haupt-Navigations-Icons -->
      <div class="flex justify-between items-center px-3 py-1">
        <!-- Hunter Bereich -->
        <button 
          class="nav-button relative"
          :class="{'active': activeSection === 'hunters'}"
          @click="toggleSection('hunters')"
        >
          <div class="nav-button-inner">
            <IconBow size="22" class="mx-auto text-indigo-200" />
            <span class="text-xs mt-1 font-medium text-slate-300">Hunters</span>
          </div>
          <span v-if="activeSection === 'hunters'" class="active-indicator"></span>
        </button>
        
        <!-- Upgrades Menü -->
        <button 
          class="nav-button relative"
          :class="{'active': activeSection === 'upgrades'}"
          @click="toggleSection('upgrades')"
        >
          <div class="nav-button-inner">
            <IconArrowUpCircle size="22" class="mx-auto text-indigo-200" />
            <span class="text-xs mt-1 font-medium text-slate-300">Upgrades</span>
          </div>
          <span v-if="activeSection === 'upgrades'" class="active-indicator"></span>
        </button>
        
        <!-- Tools Menü -->
        <button 
          class="nav-button relative"
          :class="{'active': activeSection === 'tools'}"
          @click="toggleSection('tools')"
        >
          <div class="nav-button-inner">
            <IconTools size="22" class="mx-auto text-indigo-200" />
            <span class="text-xs mt-1 font-medium text-slate-300">Tools</span>
          </div>
          <span v-if="activeSection === 'tools'" class="active-indicator"></span>
        </button>
        
        <!-- Misc (Settings etc.) -->
        <button 
          class="nav-button relative"
          :class="{'active': activeSection === 'misc'}"
          @click="toggleSection('misc')"
        >
          <div class="nav-button-inner">
            <IconSettings size="22" class="mx-auto text-indigo-200" />
            <span class="text-xs mt-1 font-medium text-slate-300">More</span>
          </div>
          <span v-if="activeSection === 'misc'" class="active-indicator"></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { NAVIGATION } from '../../constants/navigation';
import { getAllHunters } from '../../constants/hunters';
import { 
  IconArrowUpCircle,
  IconSettings,
  IconCoffee,
  IconTools,
  IconHistory,
  IconBow
} from '@tabler/icons-vue';

const navigation = NAVIGATION;
const hunters = getAllHunters();
const activeSection = ref(null);

// Ausgewählte Kategorie für Upgrades
const selectedUpgradeCategory = ref(0);

// Toggle für die Dropdown-Sektionen
function toggleSection(section) {
  if (activeSection.value === section) {
    activeSection.value = null;
  } else {
    activeSection.value = section;
    // Bei Upgrades immer die erste Kategorie vorauswählen
    if (section === 'upgrades') {
      selectedUpgradeCategory.value = 0;
    }
  }
}
</script>

<style scoped>
/* Moderne UI-Anpassungen */
/* Navigation Buttons */
.nav-button {
  width: 25%;
  padding: 0.5rem 0.25rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-button-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  transition: transform 0.2s;
}

.nav-button.active .nav-button-inner {
  transform: translateY(-2px);
}

/* Aktiv-Indikator statt Border */
.active-indicator {
  position: absolute;
  bottom: -1px;
  left: 30%;
  right: 30%;
  height: 3px;
  background: linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.8), rgba(99, 102, 241, 0.3));
  border-radius: 2px 2px 0 0;
}

/* Submenüs über der Navbar mit höherem z-index als Backdrop */
.mobile-submenu {
  position: fixed;
  bottom: 70px; /* Höhe der Navbar + Platz zum Trennen */
  left: 0.75rem;
  right: 0.75rem;
  background-color: rgba(15, 23, 42, 0.95);
  transform: translateY(20px);
  transition: all 0.25s ease-out;
  border-radius: 12px;
  opacity: 0;
  visibility: hidden;
  max-height: 0;
  overflow: hidden;
  z-index: 45; /* Über dem Backdrop (30), unter der Navbar (50) */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.15);
}

.mobile-submenu.visible {
  opacity: 1;
  visibility: visible;
  max-height: 70vh; /* Genug Platz für Inhalte, aber nicht über die ganze Seite */
  transform: translateY(0);
  overflow-y: auto;
}

/* Header für die Untermenüs */
.submenu-header {
  background: linear-gradient(to right, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
  padding: 0.75rem;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px 12px 0 0;
}

.submenu-header h3 {
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
  text-align: center;
}

/* Moderne Karten */
.modern-card {
  background-color: rgba(30, 41, 59, 0.9);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.15s ease;
  height: 100%;
  border: 1px solid rgba(99, 102, 241, 0.15);
}

.modern-card:active {
  transform: scale(0.98);
  background-color: rgba(30, 41, 59, 0.95);
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}

/* Beschriftung für Karten */
.label {
  margin-top: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: #e2e8f0;
}

/* Farbakzente für verschiedene Kartenkategorien */
.hunter-blue { border-top: 3px solid rgba(59, 130, 246, 0.7); }
.hunter-green { border-top: 3px solid rgba(34, 197, 94, 0.7); }
.hunter-purple { border-top: 3px solid rgba(168, 85, 247, 0.7); }
.hunter-red { border-top: 3px solid rgba(239, 68, 68, 0.7); }

.upgrade-card { border-top: 3px solid rgba(99, 102, 241, 0.7); }
.tool-card { border-top: 3px solid rgba(168, 85, 247, 0.7); }
.settings-card { border-top: 3px solid rgba(20, 184, 166, 0.7); }
.changelog-card { border-top: 3px solid rgba(59, 130, 246, 0.7); }
.support-card { border-top: 3px solid rgba(245, 158, 11, 0.7); }

/* Moderne Tab-Navigation */
.tab-navigation {
  display: flex;
  overflow-x: auto;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  gap: 0.5rem;
  scrollbar-width: none; /* Firefox */
}

.tab-navigation::-webkit-scrollbar {
  display: none; /* Chrome, Safari und Opera */
}

.tab-button {
  white-space: nowrap;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.76rem;
  font-weight: 500;
  transition: all 0.15s ease;
  color: #94a3b8;
  background-color: transparent;
  border: 1px solid rgba(175, 175, 238, 0.1);
  flex-shrink: 0;
}

.tab-button.active {
  background-color: rgba(99, 102, 241, 0.2);
  color: #e2e8f0;
  border-color: rgba(99, 102, 241, 0.4);
}

.tab-content {
  overflow-y: auto;
  max-height: calc(100vh - 220px); /* Optimiert für maximale Lesbarkeit */
  padding-bottom: 1rem; /* Zusätzlicher Platz am Ende */
}
</style>>