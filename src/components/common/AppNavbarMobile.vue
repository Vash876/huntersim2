<template>
  <!-- Backdrop außerhalb der nav - nur für den Hauptinhalt -->
  <div 
    v-if="activeSection" 
    class="fixed top-0 left-0 right-0 bottom-[70px] z-30 bg-slate-900/30 backdrop-blur-[1px] transition-opacity duration-300"
    @click="activeSection = null"
  ></div>
  
  <!-- Gem Level Warning - Mobile -->
  <div 
    v-if="showGemLevelWarning" 
    class="fixed bottom-[70px] left-0 right-0 bg-amber-600/90 text-white text-center py-2 px-4 text-sm font-medium z-40"
  >
    <div class="flex items-center justify-center space-x-2">
      <IconInfoCircle size="16" />
      <span>Please set your gem levels first.</span>
      <router-link 
        to="/upgrades/gems" 
        class="underline hover:text-amber-200 font-semibold ml-2"
        @click="activeSection = null"
      >
        Go to Gems →
      </router-link>
    </div>
  </div>
  
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
          v-for="hunter in filteredHunters"
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
      
      <!-- Tools Kategorien als moderne Tabs -->
      <div class="tab-navigation">
        <button 
          v-for="(category, index) in navigation.toolCategories"
          :key="index"
          class="tab-button"
          :class="{ 'active': selectedToolCategory === index }"
          @click="selectedToolCategory = index"
        >
          {{ category.name }}
        </button>
      </div>
      
      <!-- Tools für die ausgewählte Kategorie -->
      <div class="tab-content px-3 py-4">
        <div class="tab-content px-3 py-4">
          <div v-for="(category, categoryIndex) in navigation.toolCategories" :key="categoryIndex">
            <div v-if="selectedToolCategory === categoryIndex" class="grid grid-cols-2 gap-3">
              <router-link 
                v-for="tool in category.tools" 
                :key="tool.id"
                :to="tool.path"
                class="submenu-item"
                @click="activeSection = null"
              >
                <div class="modern-card" :class="getToolCardClass(category.color, tool)">
                  <div class="card-content">
                    <component :is="tool.icon" class="w-7 h-7" :class="getToolIconClass(category.color, tool)" />
                    <div class="label" :class="getToolLabelClass(category.color, tool)">
                      {{ tool.name }}
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
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

    <!-- ACCOUNT MENU -->
    <div 
      class="mobile-submenu account-submenu"
      :class="{visible: activeSection === 'account'}"
    >
      <div class="submenu-header">
        <h3 v-if="neonAuthService.isAuthenticatedComputed.value">Account</h3>
        <h3 v-else>Sign In</h3>
      </div>
      
      <!-- Unauthenticated State -->
      <div v-if="!neonAuthService.isAuthenticatedComputed.value" class="px-3 py-4">
        <button
          @click="showAuthModal = true; activeSection = null"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <IconLogin size="20" />
          <span>Sign In / Sign Up</span>
        </button>
        <p class="text-xs text-gray-400 text-center mt-3">
          Sign in to sync your data across devices
        </p>
      </div>
      
      <!-- Authenticated State -->
      <div v-else class="px-3 py-4 space-y-4">
        <!-- User Info -->
        <div class="flex items-center space-x-3 pb-3 border-b border-gray-700">
          <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {{ (neonAuthService.getUserDisplayName() || 'U').charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-white">{{ neonAuthService.getUserDisplayName() || 'User' }}</div>
            <div class="text-xs text-gray-400">{{ neonAuthService.getUserEmail() || 'No email' }}</div>
          </div>
        </div>

        <!-- Sync Status -->
        <div class="pb-3 border-b border-gray-700">
          <div class="text-xs text-gray-400 mb-2">Sync Status</div>
          <div class="flex items-center space-x-2">
            <div 
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-green-500': !syncStore.isSyncing && !syncStore.lastSyncError,
                'bg-yellow-500': syncStore.isSyncing,
                'bg-red-500': syncStore.lastSyncError
              }"
            ></div>
            <span class="text-xs text-gray-300">
              {{ syncStore.isSyncing ? 'Syncing...' : 
                 syncStore.lastSyncError ? 'Sync Error' : 
                 syncStore.lastSyncTime ? `Last: ${formatSyncTime(syncStore.lastSyncTime)}` : 'Never synced' }}
            </span>
          </div>
        </div>

        <!-- Sync Actions -->
        <div class="space-y-2 pb-3 border-b border-gray-700">
          <button
            @click="syncFromCloud"
            :disabled="syncStore.isSyncing || isWaitingForAuth"
            class="w-full text-left px-3 py-2 text-sm bg-blue-900/20 text-blue-300 hover:bg-blue-900/30 rounded-lg flex items-center space-x-2 transition-colors"
            :class="{ 'opacity-50': syncStore.isSyncing || isWaitingForAuth }"
          >
            <div class="flex items-center space-x-2">
              <IconCloudDown size="18" />
              <IconLoader2 
                v-if="(syncStore.isSyncing && syncAction === 'download') || isWaitingForAuth"
                size="14" 
                class="animate-spin"
              />
            </div>
            <span>{{ syncStore.isSyncing && syncAction === 'download' ? 'Loading...' : 
                       isWaitingForAuth ? 'Connecting...' : 'Load from Cloud' }}</span>
          </button>
          
          <button
            @click="syncToCloud"
            :disabled="syncStore.isSyncing || isWaitingForAuth"
            class="w-full text-left px-3 py-2 text-sm bg-green-900/20 text-green-300 hover:bg-green-900/30 rounded-lg flex items-center space-x-2 transition-colors"
            :class="{ 'opacity-50': syncStore.isSyncing || isWaitingForAuth }"
          >
            <div class="flex items-center space-x-2">
              <IconCloudUp size="18" />
              <IconLoader2 
                v-if="(syncStore.isSyncing && syncAction === 'upload') || isWaitingForAuth"
                size="14" 
                class="animate-spin"
              />
            </div>
            <span>{{ syncStore.isSyncing && syncAction === 'upload' ? 'Saving...' : 
                       isWaitingForAuth ? 'Connecting...' : 'Save to Cloud' }}</span>
          </button>
        </div>

        <!-- Account Management -->
        <div class="pb-3 border-b border-gray-700 space-y-2">
          <button
            @click="showFriendsModal = true; activeSection = null"
            class="w-full text-left px-3 py-2 text-sm bg-indigo-900/20 text-indigo-300 hover:bg-indigo-900/30 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <IconUsersGroup size="18" />
            <span>Friends</span>
            <span 
              v-if="friendsStore.hasPending" 
              class="ml-auto inline-flex items-center justify-center w-5 h-5 bg-red-500 text-[10px] rounded-full text-white font-bold"
            >
              {{ friendsStore.pendingCount }}
            </span>
          </button>
          <button
            @click="openAccountSettings"
            class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <IconSettings size="18" />
            <span>Account Settings</span>
          </button>
        </div>

        <!-- Sign Out -->
        <div class="pt-3">
          <button
            @click="signOut"
            class="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-900/20 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <IconLogout size="18" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Die Navbar NACH den Submenüs, damit sie immer über den Submenüs liegt -->
    <div class="bg-slate-900/95 backdrop-blur-sm border-t border-indigo-500/30 shadow-lg">
      <!-- Haupt-Navigations-Icons -->
      <div class="flex justify-between items-center px-3 py-1">
        <!-- Gems Link - An erster Stelle -->
        <router-link 
          to="/upgrades/gems"
          class="nav-button relative"
          :class="{'active': $route.path === '/upgrades/gems'}"
          @click="activeSection = null"
        >
          <div class="nav-button-inner">
            <IconDiamond size="22" class="mx-auto text-indigo-200" />
            <span class="text-xs mt-1 font-medium text-slate-300">Gems</span>
          </div>
          <span v-if="$route.path === '/upgrades/gems'" class="active-indicator"></span>
        </router-link>
        
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
        
        <!-- Account (Login/User) -->
        <button 
          class="nav-button relative"
          :class="{'active': activeSection === 'account'}"
          @click="toggleSection('account')"
        >
          <div class="nav-button-inner">
            <!-- Unauthenticated State -->
            <IconUser 
              v-if="!neonAuthService.isAuthenticatedComputed.value"
              size="22" 
              class="mx-auto text-indigo-200" 
            />
            <!-- Authenticated State -->
            <div 
              v-else
              class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto"
            >
              {{ (neonAuthService.getUserDisplayName() || 'U').charAt(0).toUpperCase() }}
            </div>
            <span class="text-xs mt-1 font-medium text-slate-300">Account</span>
          </div>
          <span v-if="activeSection === 'account'" class="active-indicator"></span>
          <!-- Friend request badge -->
          <span 
            v-if="friendsStore.hasPending" 
            class="absolute top-0 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold"
          >
            {{ friendsStore.pendingCount }}
          </span>
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

  <!-- Neon Auth Modal -->
  <NeonAuthModal 
    :show="showAuthModal"
    @close="showAuthModal = false"
    @success="handleAuthSuccess"
  />

  <!-- Account Settings Modal -->
  <AccountSettingsModal 
    :show="showAccountSettings"
    @close="showAccountSettings = false"
  />

  <!-- Friends Modal -->
  <FriendsModal
    :show="showFriendsModal"
    @close="showFriendsModal = false"
  />

  <!-- Toast Notification -->
  <div 
    v-if="notification.show"
    class="fixed bottom-20 right-4 z-[60] bg-gray-800 border rounded-lg shadow-lg p-4 max-w-sm animate-slide-up"
    :class="{
      'border-green-500': notification.type === 'success',
      'border-red-500': notification.type === 'error', 
      'border-blue-500': notification.type === 'info'
    }"
  >
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0 mt-0.5">
        <IconCircleCheck 
          v-if="notification.type === 'success'"
          size="20" 
          class="text-green-400"
        />
        <IconAlertCircle 
          v-else-if="notification.type === 'error'"
          size="20" 
          class="text-red-400"
        />
        <IconInfoCircle 
          v-else
          size="20" 
          class="text-blue-400"
        />
      </div>
      <div class="flex-1">
        <p class="text-sm text-gray-200">{{ notification.message }}</p>
      </div>
      <button 
        @click="hideNotification"
        class="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { NAVIGATION, SECRET_ACCESS_IDS, hasSecretAccessCached } from '../../constants/navigation';
import { getAllHunters } from '../../constants/hunters';
import { useRoute } from 'vue-router';
import { neonAuthService } from '@/services/neonAuthService';
import { useSyncStore } from '@/store/syncStore';
import { useFriendsStore } from '@/store/friendsStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useBackupRestore } from '@/composables/useBackupRestore';
import NeonAuthModal from '@/components/common/NeonAuthModal.vue';
import AccountSettingsModal from '@/components/common/AccountSettingsModal.vue';
import FriendsModal from '@/components/common/FriendsModal.vue';
import { 
  IconArrowUpCircle,
  IconSettings,
  IconCoffee,
  IconTools,
  IconHistory,
  IconBow,
  IconUser,
  IconLogin,
  IconLogout,
  IconCloudDown,
  IconCloudUp,
  IconLoader2,
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconDiamond,
  IconUsersGroup
} from '@tabler/icons-vue';

const hunters = getAllHunters();
const route = useRoute();
const activeSection = ref(null);
const syncStore = useSyncStore();
const friendsStore = useFriendsStore();
const gemPlannerStore = useGemPlannerStore();
const { createBackup, restoreFromBackup, isCreatingBackup, isRestoring } = useBackupRestore();

const navigation = computed(() => {
  const filteredNavigation = { ...NAVIGATION };
  
  // Filter hunters basierend auf Gem-Unlock-Bedingungen
  filteredNavigation.hunters = NAVIGATION.hunters.filter(hunter => {
    // Prüfe ob der Hunter Unlock-Bedingungen hat
    if (!hunter.unlock || !hunter.unlock_lvl) {
      return true; // Zeige Hunter ohne Unlock-Bedingungen immer an
    }

    // Hole den Gem-Status
    const gemState = gemPlannerStore.getGemState(hunter.unlock);
    if (!gemState) {
      return false; // Gem existiert nicht
    }

    // Prüfe Gem-Level
    if (gemState.level < hunter.unlock_lvl) {
      return false; // Gem-Level zu niedrig
    }

    // Prüfe Gem-Node (falls angegeben)
    if (hunter.unlock_node !== undefined) {
      const nodeIndex = hunter.unlock_node - 1; // Node 5 = Index 4
      if (!gemState.nodes || !gemState.nodes[nodeIndex]) {
        return false; // Node nicht aktiviert
      }
    }

    return true; // Alle Bedingungen erfüllt
  });
  
  // Filter toolCategories
  const userId = neonAuthService.getUserId();
  const hasSecretAccess = SECRET_ACCESS_IDS.includes(userId) || hasSecretAccessCached();
  
  filteredNavigation.toolCategories = NAVIGATION.toolCategories.filter(category => {
    if (category.secret && !hasSecretAccess) return false;
    return true;
  }).map(category => ({
    ...category,
    tools: category.tools.filter(tool => {
      // Prüfe ob das Tool Unlock-Bedingungen hat
      if (!tool.unlock || !tool.unlock_lvl) {
        return true; // Zeige Tools ohne Unlock-Bedingungen immer an
      }

      // Hole den Gem-Status
      const gemState = gemPlannerStore.getGemState(tool.unlock);
      if (!gemState) {
        return false; // Gem existiert nicht
      }

      // Prüfe Gem-Level
      if (gemState.level < tool.unlock_lvl) {
        return false; // Gem-Level zu niedrig
      }

      // Prüfe Gem-Node (falls angegeben) - besonders wichtig für AttGN#3 Calculator
      if (tool.unlock_node !== undefined) {
        const nodeIndex = tool.unlock_node - 1; // Node 3 = Index 2
        if (!gemState.nodes || !gemState.nodes[nodeIndex]) {
          return false; // Node nicht aktiviert
        }
      }

      return true; // Alle Bedingungen erfüllt
    })
  }));
  
  // Filter upgradeCategories basierend auf Gem-Leveln
  filteredNavigation.upgradeCategories = NAVIGATION.upgradeCategories.map(category => ({
    ...category,
    links: category.links.filter(link => {
      // Prüfe ob das Link Unlock-Bedingungen hat
      if (!link.unlock_gem || !link.unlock_lvl) {
        return true; // Zeige Links ohne Unlock-Bedingungen immer an
      }

      // Hole den Gem-Status
      const gemState = gemPlannerStore.getGemState(link.unlock_gem);
      if (!gemState) {
        return false; // Gem existiert nicht
      }

      // Prüfe Gem-Level
      if (gemState.level < link.unlock_lvl) {
        return false; // Gem-Level zu niedrig
      }

      // Prüfe Gem-Node (falls angegeben)
      if (link.unlock_node !== undefined) {
        const nodeIndex = link.unlock_node - 1; // Node 5 = Index 4
        if (!gemState.nodes || !gemState.nodes[nodeIndex]) {
          return false; // Node nicht aktiviert
        }
      }

      return true; // Alle Bedingungen erfüllt
    })
  }));
  
  return filteredNavigation;
});

// Gefilterte Hunter mit vollständigen Daten (inkl. Bilder)
const filteredHunters = computed(() => {
  // Nutze die bereits gefilterten Hunter-IDs aus navigation
  const allowedHunterIds = navigation.value.hunters.map(h => h.id);
  
  // Filtere die vollständigen Hunter-Daten basierend auf den erlaubten IDs
  return hunters.filter(hunter => allowedHunterIds.includes(hunter.id));
});

// Computed für Gem-Level-Warnung - Mobile
const showGemLevelWarning = computed(() => {
  // Prüfe ob alle Gems auf Level 0 sind
  const allGems = gemPlannerStore.gemStates;
  
  if (!allGems || typeof allGems !== 'object') {
    console.log('Mobile: Store nicht initialisiert - verstecke Warnung');
    return false; // Verstecke Warnung wenn Store nicht initialisiert ist
  }
  
  // Wenn keine Gems vorhanden sind, zeige Warnung
  const gemKeys = Object.keys(allGems);
  if (gemKeys.length === 0) {
    console.log('Mobile: Keine Gems vorhanden - zeige Warnung');
    return true;
  }
  
  // Prüfe ob alle Gems auf Level 0 sind
  const allGemsAtZero = Object.values(allGems).every(gem => (gem?.level || 0) === 0);
  console.log('Mobile: Alle Gems auf Level 0:', allGemsAtZero, 'Gem States:', allGems);
  return allGemsAtZero;
});

// Watch für Store-Änderungen um Reaktivität sicherzustellen - Mobile
watch(() => gemPlannerStore.gemStates, (newGems) => {
  console.log('Mobile: Gem Store changed:', newGems);
}, { deep: true });

const showAuthModal = ref(false);
const showAccountSettings = ref(false);
const showFriendsModal = ref(false);
const syncAction = ref(null);
const syncNotification = ref({ show: false, message: '', type: 'info' });
const isWaitingForAuth = ref(false); // New state for timeout period

// Initialize Neon Auth and Sync Store
neonAuthService.initAuth();
syncStore.init();

// Check for sign-in query parameter and handle page refresh auth delay
onMounted(() => {
  if (route.query.signIn === 'true') {
    showAuthModal.value = true;
  }
  
  // Disable sync buttons for 5 seconds after page refresh to allow auth to stabilize
  isWaitingForAuth.value = true;
  setTimeout(() => {
    isWaitingForAuth.value = false;
    // Initialize friends store if user is already authenticated
    const user = neonAuthService.getCurrentUser();
    if (user) {
      friendsStore.init(user);
    }
  }, 5000);
});

// Watch for route changes to handle sign-in parameter
watch(() => route.query, (newQuery) => {
  if (newQuery.signIn === 'true') {
    showAuthModal.value = true;
  }
});

// Notification state (keeping old structure for backward compatibility)
const notification = ref({
  show: false,
  type: 'success', // 'success', 'error', 'info'
  message: '',
  timeout: null
});

// Ausgewählte Kategorie für Upgrades
const selectedUpgradeCategory = ref(0);
const selectedToolCategory = ref(0);

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

// Auth und Sync functions
function handleAuthSuccess(type) {
  showAuthModal.value = false;
  activeSection.value = null;
  // Initialize friends store when user signs in
  const user = neonAuthService.getCurrentUser();
  if (user) {
    friendsStore.init(user);
  }
}

async function signOut() {
  try {
    await neonAuthService.signOut();
    activeSection.value = null;
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}

function openAccountSettings() {
  showAccountSettings.value = true;
  activeSection.value = null;
}

// Notification functions (using both structures for compatibility)
function showNotification(type, message) {
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout);
  }
  
  notification.value.show = true;
  notification.value.type = type;
  notification.value.message = message;
  
  notification.value.timeout = setTimeout(() => {
    notification.value.show = false;
  }, 5000);
}

function showSyncNotification(message, type = 'info') {
  syncNotification.value = { show: true, message, type };
  setTimeout(() => {
    syncNotification.value.show = false;
  }, 5000);
  
  // Also show via the mobile notification system
  showNotification(type, message);
}

function hideNotification() {
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout);
  }
  notification.value.show = false;
}

async function syncFromCloud() {
  try {
    syncAction.value = 'download';
    await syncStore.syncFromServer();
    showSyncNotification('Data successfully loaded from cloud', 'success');
    activeSection.value = null;
  } catch (error) {
    console.error('Sync from cloud failed:', error);
    showSyncNotification(`Load failed: ${error.message}`, 'error');
  } finally {
    syncAction.value = null;
  }
}

async function syncToCloud() {
  try {
    syncAction.value = 'upload';
    await syncStore.syncToServer();
    showSyncNotification('Data successfully saved to cloud', 'success');
    activeSection.value = null;
  } catch (error) {
    console.error('Sync to cloud failed:', error);
    showSyncNotification(`Save failed: ${error.message}`, 'error');
  } finally {
    syncAction.value = null;
  }
}

function formatSyncTime(timestamp) {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  return `${Math.floor(diffMinutes / 1440)}d ago`;
}

// Helper-Funktionen für Tool-Farben
function getToolCardClass(categoryColor, tool) {
  // Individuelle Tool-Farbe hat Priorität über Kategorie-Farbe
  const color = tool.color || categoryColor;
  switch(color) {
    case 'blue': return 'tool-card-blue';
    case 'green': return 'tool-card-green';
    case 'purple': return 'tool-card-purple';
    case 'red': return 'tool-card-red';
    case 'orange': return 'tool-card-orange';
    default: return 'tool-card';
  }
}

function getToolIconClass(categoryColor, tool) {
  // Individuelle Tool-Farbe hat Priorität über Kategorie-Farbe
  const color = tool.color || categoryColor;
  switch(color) {
    case 'blue': return 'text-blue-400';
    case 'green': return 'text-green-400';
    case 'purple': return 'text-purple-400';
    case 'red': return 'text-red-400';
    case 'orange': return 'text-orange-400';
    default: return 'text-purple-400';
  }
}

function getToolLabelClass(categoryColor, tool) {
  // Individuelle Tool-Farbe hat Priorität über Kategorie-Farbe
  const color = tool.color || categoryColor;
  switch(color) {
    case 'blue': return 'text-blue-200';
    case 'green': return 'text-green-200';
    case 'purple': return 'text-purple-200';
    case 'red': return 'text-red-200';
    case 'orange': return 'text-orange-200';
    default: return 'text-purple-200';
  }
}
</script>

<style scoped>
/* Moderne UI-Anpassungen */
/* Navigation Buttons */
.nav-button {
  width: 16.666667%; /* 100% / 6 für 6 Buttons */
  padding: 0.35rem 0.25rem;
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

.nav-button .mx-auto {
  margin-bottom: -2px; /* Negativer Abstand zum Text */
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
  bottom: 60px; /* Höhe der Navbar + Platz zum Trennen */
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
.tool-card-blue { border-top: 3px solid rgba(59, 130, 246, 0.7); }
.tool-card-green { border-top: 3px solid rgba(34, 197, 94, 0.7); }
.tool-card-red { border-top: 3px solid rgba(239, 68, 68, 0.7); }
.tool-card-orange { border-top: 3px solid rgba(249, 115, 22, 0.7); }
.tool-card-purple { border-top: 3px solid rgba(168, 85, 247, 0.7); }

.settings-card { border-top: 3px solid rgba(20, 184, 166, 0.7); }
.changelog-card { border-top: 3px solid rgba(59, 130, 246, 0.7); }
.support-card { border-top: 3px solid rgba(245, 158, 11, 0.7); }

/* Account Menu Styling */
.account-submenu .modern-card {
  background-color: rgba(30, 41, 59, 0.95);
}

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

/* Toast Animation */
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>>