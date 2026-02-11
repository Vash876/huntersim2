<template>
  <header class="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg relative z-50">
    <!-- Gem Level Warning -->
    <div 
      v-if="showGemLevelWarning" 
      class="bg-amber-600/90 text-white text-center py-2 px-4 text-sm font-medium"
    >
      <div class="flex items-center justify-center space-x-2">
        <IconInfoCircle size="16" />
        <span>Please set your gem levels first.</span>
        <router-link 
          to="/upgrades/gems" 
          class="underline hover:text-amber-200 font-semibold ml-2"
        >
          Go to Gems →
        </router-link>
      </div>
    </div>
    
    <!-- Dekorativer Farbverlauf an der Oberseite -->
    <div class="h-1 gradient-scroll"></div>
    
    <!-- Desktop Navigation -->
    <div class="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
      <!-- Logo & Branding -->
      <router-link to="/home" class="flex items-center group no-underline hover:opacity-90 transition-opacity">
        <div class="mr-3 bg-gradient-to-br from-blue-400 to-purple-600 p-2 rounded-lg shadow-glow transition-all duration-300">
          <IconTargetArrow size="24" class="text-white" />
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-bold tracking-wide text-white text-shadow-lg/100">CIFI Tools</span>
          <span class="text-xs text-gray-400">Hunter Simulator & Game Tools</span>
        </div>
      </router-link>
      
      <!-- Navigation Links -->
      <nav class="flex items-center">
        <!-- Gems Link - Prominent an erster Stelle -->
        <div class="bg-gray-800/90 rounded-xl p-1 mr-2">
          <router-link 
            to="/upgrades/gems"
            class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center mx-0.5 hover:bg-gray-750"
            :class="[$route.path === '/upgrades/gems' ? 'bg-purple-700 text-white shadow-sm' : 'text-gray-300 hover:text-white']"
          >
            <IconDiamond class="w-5 h-5 mr-1.5" />
            <span class="font-semibold">Gems</span>
          </router-link>
        </div>

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
          <!-- Upgrades Link -->
          <router-link 
            to="/upgrades"
            class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center mx-0.5 hover:bg-gray-750"
            :class="[$route.path.startsWith('/upgrades/') && $route.path !== '/upgrades/gems' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-300 hover:text-white']"
          >
            <IconArrowUpCircle size="18" class="mr-1.5" />
            <span>Upgrades</span>
          </router-link>
        </div> 

        <div class="bg-gray-800/90 rounded-xl p-1 mr-2 flex items-center">
          <!-- Tools Link -->
          <router-link 
            to="/tools"
            class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center mx-0.5 hover:bg-gray-750"
            :class="[$route.path.startsWith('/tools/') ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-300 hover:text-white']"
          >
            <IconTools size="18" class="mr-1.5" />
            <span>Tools</span>
          </router-link>
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

          <!-- User Account Section -->
          <div class="mx-0.5 pl-2">
            <!-- Unauthenticated State -->
            <button
              v-if="!neonAuthService.isAuthenticatedComputed.value"
              @click="showAuthModal = true"
              class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center hover:bg-blue-600 bg-blue-700 text-white"
            >
              <IconLogin size="18" class="mr-1.5" />
              <span>Sign In</span>
            </button>

            <!-- Authenticated State -->
            <div v-else class="relative">
              <button
                @click="toggleCategory('Account')"
                class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center hover:bg-gray-750"
                :class="[activeCategory === 'Account' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-300 hover:text-white']"
              >
                <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  {{ (neonAuthService.getUserDisplayName() || 'U').charAt(0).toUpperCase() }}
                </div>
                <span class="hidden lg:inline">{{ neonAuthService.getUserDisplayName() || 'User' }}</span>
                <IconChevronDown 
                  size="16" 
                  class="ml-1.5 transition-transform duration-200"
                  :class="{'rotate-180': activeCategory === 'Account'}"
                />
              </button>

              <!-- Account Dropdown -->
              <div 
                class="absolute top-full right-0 mt-2 bg-gray-800 rounded-xl shadow-xl transform transition-all duration-100 origin-top-right z-50 border border-gray-700 w-64 overflow-hidden" 
                :class="activeCategory === 'Account' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
              >
                <div class="p-4">
                  <!-- User Info -->
                  <div class="flex items-center space-x-3 pb-3 border-b border-gray-700">
                    <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {{ (neonAuthService.getUserDisplayName() || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-white">{{ neonAuthService.getUserDisplayName() || 'User' }}</div>
                      <div class="text-xs text-gray-400">{{ neonAuthService.getUserEmail() || 'No email' }}</div>
                    </div>
                  </div>

                  <!-- Sync Status -->
                  <div class="py-3 border-b border-gray-700">
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
                  <div class="py-3 space-y-1 border-b border-gray-700">
                    <button
                      @click="syncFromCloud"
                      :disabled="syncStore.isSyncing || isWaitingForAuth"
                      class="w-full text-left px-3 py-2 text-sm text-blue-300 hover:bg-blue-900/20 rounded flex items-center space-x-2"
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
                      class="w-full text-left px-3 py-2 text-sm text-green-300 hover:bg-green-900/20 rounded flex items-center space-x-2"
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
                  <div class="py-3 space-y-1 border-b border-gray-700">
                    <button
                      @click="openAccountSettings"
                      class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded flex items-center space-x-2"
                    >
                      <IconSettings size="18" />
                      <span>Account Settings</span>
                    </button>
                  </div>

                  <!-- Sign Out -->
                  <div class="py-3 space-y-1">
                    <button
                      @click="signOut"
                      class="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-900/20 rounded flex items-center space-x-2"
                    >
                      <IconLogout size="18" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

    <!-- Sync Notification -->
    <Transition name="toast">
      <div 
        v-if="syncNotification.show" 
        class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white flex items-center z-50"
        :class="{
          'bg-green-600': syncNotification.type === 'success',
          'bg-red-600': syncNotification.type === 'error',
          'bg-blue-600': syncNotification.type === 'info'
        }"
      >
        <div v-if="syncNotification.type === 'success'">
          <IconCircleCheck size="20" class="mr-2" />
        </div>
        <div v-else-if="syncNotification.type === 'error'">
          <IconAlertCircle size="20" class="mr-2" />
        </div>
        <div v-else>
          <IconInfoCircle size="20" class="mr-2" />
        </div>
        <span class="text-sm">{{ syncNotification.message }}</span>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { NAVIGATION } from '../../constants/navigation';
import { useRoute } from 'vue-router';
import { neonAuthService } from '@/services/neonAuthService';
import { useSyncStore } from '@/store/syncStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useBackupRestore } from '@/composables/useBackupRestore';
import NeonAuthModal from '@/components/common/NeonAuthModal.vue';
import AccountSettingsModal from '@/components/common/AccountSettingsModal.vue';
import { 
  IconTargetArrow, 
  IconChevronDown, 
  IconArrowUpCircle,
  IconSettings,
  IconCoffee,
  IconTools,
  IconLogin,
  IconLogout,
  IconCloudDown,
  IconCloudUp,
  IconLoader2,
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconDiamond
} from '@tabler/icons-vue';

const route = useRoute();
const syncStore = useSyncStore();
const gemPlannerStore = useGemPlannerStore();
const { createBackup, restoreFromBackup, isCreatingBackup, isRestoring } = useBackupRestore();

// Computed für gefilterte Navigation basierend auf Gem-Leveln
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
  filteredNavigation.toolCategories = NAVIGATION.toolCategories.map(category => ({
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
  
  // Filter upgradeCategories
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

// Computed für Gem-Level-Warnung
const showGemLevelWarning = computed(() => {
  // Prüfe ob alle Gems auf Level 0 sind
  const allGems = gemPlannerStore.gemStates;
  
  if (!allGems || typeof allGems !== 'object') {
    console.log('Store nicht initialisiert - verstecke Warnung');
    return false; // Verstecke Warnung wenn Store nicht initialisiert ist
  }
  
  // Wenn keine Gems vorhanden sind, zeige Warnung
  const gemKeys = Object.keys(allGems);
  if (gemKeys.length === 0) {
    console.log('Keine Gems vorhanden - zeige Warnung');
    return true;
  }
  
  // Prüfe ob alle Gems auf Level 0 sind
  const allGemsAtZero = Object.values(allGems).every(gem => (gem?.level || 0) === 0);
  console.log('Alle Gems auf Level 0:', allGemsAtZero, 'Gem States:', allGems);
  return allGemsAtZero;
});

// Watch für Store-Änderungen um Reaktivität sicherzustellen
watch(() => gemPlannerStore.gemStates, (newGems) => {
  console.log('Gem Store changed:', newGems);
}, { deep: true });

// Desktop menu state
const activeCategory = ref(null);
const showAuthModal = ref(false);
const showAccountSettings = ref(false);
const syncAction = ref(null); // 'upload', 'download', or null
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
  }, 5000);
});

// Watch for route changes to handle sign-in parameter
watch(() => route.query, (newQuery) => {
  if (newQuery.signIn === 'true') {
    showAuthModal.value = true;
  }
});

// Components
const components = {
  NeonAuthModal
};

// Methods
// Toggle category function
function toggleCategory(category) {
  if (activeCategory.value === category) {
    activeCategory.value = null;
  } else {
    activeCategory.value = category;
  }
}

async function signOut() {
  try {
    await neonAuthService.signOut();
    activeCategory.value = null;
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}

function handleAuthSuccess(type) {
  showAuthModal.value = false;
  activeCategory.value = null;
}

function openAccountSettings() {
  showAccountSettings.value = true;
  activeCategory.value = null;
}

// Sync functions
async function syncFromCloud() {
  try {
    syncAction.value = 'download';
    await syncStore.syncFromServer();
    showSyncNotification('Data successfully loaded from cloud', 'success');
    activeCategory.value = null;
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
    activeCategory.value = null;
  } catch (error) {
    console.error('Sync to cloud failed:', error);
    showSyncNotification(`Save failed: ${error.message}`, 'error');
  } finally {
    syncAction.value = null;
  }
}

function showSyncNotification(message, type = 'info') {
  syncNotification.value = { show: true, message, type };
  setTimeout(() => {
    syncNotification.value.show = false;
  }, 5000);
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

/* View Transitions: Schließe Dropdowns und Overlays aus dem Screenshot aus */
header > div > nav > div > div.relative > div.absolute {
  view-transition-name: none !important;
}

/* Wandernder Farbverlauf */
.gradient-scroll {
  background: linear-gradient(
    90deg,
    #3b82f6, #8b5cf6, #ec4899, #8b5cf6, #3b82f6, #8b5cf6, #ec4899, #8b5cf6, #3b82f6
  );
  background-size: 200% 100%;
  animation: gradient-scroll 128s linear infinite;
}

@keyframes gradient-scroll {
  0% { background-position: 0% 0; }
  100% { background-position: -200% 0; }
}

/* Toast Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>