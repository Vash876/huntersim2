import { createRouter, createWebHistory } from 'vue-router';
import { SECRET_ACCESS_IDS, checkAndCacheSecretAccess, hasSecretAccessCached } from '../constants/navigation';
import { neonAuthService } from '../services/neonAuthService';
import { watch } from 'vue';
import HunterView from '../views/HunterView.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/:hunterId',
    name: 'Hunter',
    component: HunterView,
    // Optional: Hier könntest du gültige Hunter-IDs definieren
    // Wenn du sicherstellen möchtest, dass nur gültige Hunter-IDs verwendet werden
    beforeEnter: (to, from, next) => {
      const validHunterIds = ['borge', 'ozzy', 'knox'];
      if (validHunterIds.includes(to.params.hunterId)) {
        next();
      } else {
        next('/borge'); // Standardmäßig zu Borge umleiten
      }
    }
  },
 /* {
    path: '/:hunterId/buildform',
    name: 'BuildForm',
    // Hier würde deine Build-Formular-Komponente importiert werden
    component: () => import('../views/BuildFormView.vue')
  },*/
  // Gems Route (standalone, nicht im Tab-Layout)
  {
    path: '/upgrades/gems',
    name: 'Gems',
    component: () => import('../views/upgrades/Gems.vue')
  },
  // Upgrade Routes (nested unter UpgradesLayout mit Tab-Navigation)
  {
    path: '/upgrades',
    component: () => import('../views/upgrades/UpgradesLayout.vue'),
    children: [
      { path: 'relics',          name: 'Relics',                  component: () => import('../views/upgrades/Relics.vue') },
      { path: 'researches',      name: 'Researches',              component: () => import('../views/upgrades/Researches.vue') },
      { path: 'gadgets',         name: 'Gadgets',                 component: () => import('../views/upgrades/Gadgets.vue') },
      { path: 'inscryptions',    name: 'Inscryptions',            component: () => import('../views/upgrades/Inscryptions.vue') },
      { path: 'loopmods',        name: 'LoopMods',                component: () => import('../views/upgrades/LoopMods.vue') },
      { path: 'shardmilestones',  name: 'Milestones',              component: () => import('../views/upgrades/Milestones.vue') },
      { path: 'cms',             name: 'Construction Milestones', component: () => import('../views/upgrades/ConstructionMilestones.vue') },
      { path: 'trinkets',        name: 'Trinkets',                component: () => import('../views/upgrades/Trinkets.vue') },
      { path: 'diamondspecials', name: 'Diamond Specials',        component: () => import('../views/upgrades/DiamondSpecials.vue') },
      { path: 'diamondcards',    name: 'Diamond Cards',           component: () => import('../views/upgrades/DiamondCards.vue') },
      { path: 'iap',             name: 'IAP',                     component: () => import('../views/upgrades/IAP.vue') },
      { path: 'ultima',          name: 'Ultima',                  component: () => import('../views/upgrades/Ultima.vue') },
      { path: 'matsexchange',     name: 'Material Exchange',       component: () => import('../views/upgrades/MaterialExchange.vue') },
    ]
  },


  // Tools Routes (nested unter ToolsLayout mit Sidebar-Navigation)
  {
    path: '/tools',
    component: () => import('../views/tools/ToolsLayout.vue'),
    children: [
      { path: 'tr-planner',           name: 'TR Planner',             component: () => import('../views/tools/TRPlanner.vue') },
      { path: 'tr-tracking',          name: 'TR Tracking',            component: () => import('../views/tools/TRTracking.vue') },
      { path: 'gem-plannner',         name: 'Gem Planner',            component: () => import('../views/tools/GemPlanner.vue') },
      { path: 'gadget-calculator',    name: 'Gadget Calculator',      component: () => import('../views/tools/GadgetCalculator.vue') },
      { path: 'mech-planner',         name: 'Mech Planner',           component: () => import('../views/tools/MechPlanner.vue') },
      { path: 'ts-planner',           name: 'Trait Sphere Planner',   component: () => import('../views/tools/TSPlanner.vue') },
      { path: 'loopmod-overview',     name: 'Loop Mod Overview',      component: () => import('../views/tools/LoopModOverview.vue') },
      { path: 'research-overview',    name: 'Research Overview',      component: () => import('../views/tools/ResearchOverview.vue') },
      { path: 'build-repository',     name: 'Build Repository',       component: () => import('../views/tools/BuildRepository.vue') },
      { path: 'm0cost-overview',      name: 'M0 Cost Overview',       component: () => import('../views/tools/M0CostOverview.vue') },
      { path: 'attgn3-calculator',    name: 'AttGN#3 Calculator',     component: () => import('../views/tools/AttrGN3Calculator.vue') },
      { path: 'ultima-calculator',    name: 'Ultima Calculator',      component: () => import('../views/tools/UltimaCalculator.vue') },
      { path: 'inscryption-planner',  name: 'Inscryption Planner',    component: () => import('../views/tools/InscryptionPlanner.vue') },
      { path: 'relic-planner',        name: 'Relic Planner',          component: () => import('../views/tools/RelicPlanner.vue') },
      { path: 'token-planner',        name: 'Token Planner',          component: () => import('../views/tools/token-planner/TokenPlanner.vue') },
      { path: 'mission-planner',      name: 'Mission Planner',        component: () => import('../views/tools/mission-planner/MissionPlanner.vue'),
        beforeEnter: async (to, from, next) => {
          // Fast-path: localStorage cache (synchron verfügbar)
          if (hasSecretAccessCached()) {
            // Verifiziere im Hintergrund ob noch berechtigt
            if (!neonAuthService.isLoading.value) {
              const userId = neonAuthService.getUserId();
              if (!checkAndCacheSecretAccess(userId)) {
                next({ name: 'NotFound' });
                return;
              }
            }
            next();
            return;
          }
          
          // Kein Cache: warte auf Auth-Initialisierung
          if (neonAuthService.isLoading.value) {
            await new Promise(resolve => {
              const unwatch = watch(() => neonAuthService.isLoading.value, (loading) => {
                if (!loading) {
                  unwatch();
                  resolve();
                }
              }, { immediate: true });
            });
          }
          
          const userId = neonAuthService.getUserId();
          if (checkAndCacheSecretAccess(userId)) {
            next();
          } else {
            next({ name: 'NotFound' });
          }
        }
      },
      { path: 'miscellaneous',         name: 'Miscellaneous',          component: () => import('../views/tools/miscellaneous/Miscellaneous.vue') },
      { path: 'tr-planner-new',       name: 'TR Planner (New)',       component: () => import('../views/tools/tr-planner/TRPlannerNew.vue') },
    ]
  },
  // Token Debug (standalone, nicht im Sidebar-Layout)
  {
    path: '/tools/token-planner/debug',
    name: 'Token Debug',
    component: () => import('../views/tools/token-planner/TokenDebug.vue'),
  },

  // Debug Routes
  {
    path: '/debug/enemy-stats',
    name: 'Enemy Stats Debug',
    component: () => import('../views/debug/EnemyStatsDebug.vue'),
  },
  {
    path: '/admin/backup-downloader',
    name: 'Admin Backup Downloader',
    component: () => import('../views/admin/BackupDownloader.vue'),
  },

  // Settings Route
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue')
  },
  // Legacy OAuth routes — redirect to home (Firebase uses popup, no callback needed)
  {
    path: '/handler/:pathMatch(.*)*',
    name: 'LegacyHandlers',
    redirect: '/'
  },
  // 404 Route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Wenn eine savedPosition existiert oder die Route einen Hash hat,
    // lasse den Browser entscheiden
    if (savedPosition || to.hash) {
      return savedPosition || { el: to.hash };
    }
    
    // Wenn die Route Parameter oder Query identisch sind,
    // scrolle nicht
    if (from.name === to.name && 
        JSON.stringify(from.params) === JSON.stringify(to.params) &&
        JSON.stringify(from.query) === JSON.stringify(to.query)) {
      return false; // Verhindert das Scrollen
    }
    
    // Ansonsten scrolle nach oben
    return { top: 0 };
  }
})

// Handle chunk load failures after new deployments
// When a new version is deployed, old JS chunks no longer exist on the server.
// This catches the resulting import errors and reloads the page once to get the new chunks.
router.onError((error, to) => {
  const chunkFailedMessage = /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/;
  if (chunkFailedMessage.test(error.message)) {
    // Prevent infinite reload loops by checking sessionStorage
    const reloadKey = 'chunk-reload-' + to.fullPath;
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, '1');
      window.location.assign(to.fullPath);
    }
  }
});

// View Transitions API - Smooth Page Transitions
router.beforeResolve((to, from) => {
  // Feature Detection: Prüfe ob Browser View Transitions unterstützt
  if (!document.startViewTransition) {
    return true; // Fallback: Normale Navigation ohne Transition
  }

  // Skip auf erster Navigation (kein 'from')
  if (!from.name) {
    return true;
  }

  // Skip wenn gleiche Route (nur Query/Hash geändert)
  if (from.path === to.path) {
    return true;
  }

  // Warte kurz, damit Dropdowns/Modals schließen können
  return new Promise((resolve) => {
    setTimeout(() => {
      document.startViewTransition(async () => {
        resolve();
        // Warte einen Frame, damit Router View updaten kann
        await new Promise(r => setTimeout(r, 0));
      });
    }, 100); // 150ms Delay für Dropdown-Close Animation (duration-100 + Buffer)
  });
});

// Update title on route change: always "CIFI Tools" + " - Dev" on dev server
router.afterEach(() => {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  document.title = isDev ? 'CIFI Tools - Dev' : 'CIFI Tools';
});

export default router