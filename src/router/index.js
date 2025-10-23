import { createRouter, createWebHistory } from 'vue-router';
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
  // Upgrade Routes
  {
    path: '/upgrades/relics',
    name: 'Relics',
    component: () => import('../views/upgrades/Relics.vue')
  },
  {
    path: '/upgrades/researches',
    name: 'Researches',
    component: () => import('../views/upgrades/Researches.vue')
  },
  {
    path: '/upgrades/gadgets',
    name: 'Gadgets',
    component: () => import('../views/upgrades/Gadgets.vue')
  },
  {
    path: '/upgrades/gems',
    name: 'Gems',
    component: () => import('../views/upgrades/Gems.vue')
  },
  {
    path: '/upgrades/inscryptions',
    name: 'Inscryptions',
    component: () => import('../views/upgrades/Inscryptions.vue')
  },
  {
    path: '/upgrades/loopmods',
    name: 'LoopMods',
    component: () => import('../views/upgrades/LoopMods.vue')
  },
  {
    path: '/upgrades/milestones',
    name: 'Milestones',
    component: () => import('../views/upgrades/Milestones.vue')
  },
  {
    path: '/upgrades/cms',
    name: 'Construction Milestones',
    component: () => import('../views/upgrades/ConstructionMilestones.vue')
  },
  {
    path: '/upgrades/trinkets',
    name: 'Trinkets',
    component: () => import('../views/upgrades/Trinkets.vue')
  },
  {
    path: '/upgrades/diamondspecials',
    name: 'Diamond Specials',
    component: () => import('../views/upgrades/DiamondSpecials.vue')
  },
  {
    path: '/upgrades/diamondcards',
    name: 'Diamond Cards',
    component: () => import('../views/upgrades/DiamondCards.vue')
  },
  {
    path: '/upgrades/iap',
    name: 'IAP',
    component: () => import('../views/upgrades/IAP.vue')
  },
  {
    path: '/upgrades/ultima',
    name: 'Ultima',
    component: () => import('../views/upgrades/Ultima.vue')
  },


  // Tools Routes
  /*/ Other Routes*/
  {
    path: '/tools/tr-planner',
    name: 'TR Planner',
    component: () => import('../views/tools/TRPlanner.vue'),
  },
  {
    path: '/tools/tr-tracking',
    name: 'TR Tracking',
    component: () => import('../views/tools/TRTracking.vue'),
  },
  {
    path: '/tools/test',
    name: 'Test',
    component: () => import('../views/tools/Test.vue'),
  },
  {
    path: '/tools/gem-planner',
    name: 'Gem Planner',
    component: () => import('../views/tools/GemPlanner.vue'),
  },
  {
    path: '/tools/gadget-calculator',
    name: 'Gadget Calculator',    
    component: () => import('../views/tools/GadgetCalculator.vue'),
  },
  {
    path: '/tools/mech-planner',
    name: 'Mech Planner',
    component: () => import('../views/tools/MechPlanner.vue'),
  },
  {
    path: '/tools/ts-planner',
    name: 'Trait Sphere Planner',
    component: () => import('../views/tools/TSPlanner.vue'),
  },
  {
    path: '/tools/loopmod-overview',
    name: 'Loop Mod Overview',
    component: () => import('../views/tools/LoopModOverview.vue'),
  },
  {
    path: '/tools/research-overview',
    name: 'Research Overview',
    component: () => import('../views/tools/ResearchOverview.vue'),
  },
  // Admin Panel - nur in Development verfügbar
  ...(import.meta.env.DEV ? [{
    path: '/admin',
    name: 'Admin Panel',
    component: () => import('../views/AdminPanel.vue'),
    meta: { requiresAuth: true }
  }] : []),
  {
    path: '/tools/build-repository',
    name: 'Build Repository',
    component: () => import('../views/tools/BuildRepository.vue'),
  },
  {
    path: '/tools/m0cost-overview',
    name: 'M0 Cost Overview',
    component: () => import('../views/tools/M0CostOverview.vue'),
  },
  {
    path: '/tools/attgn3-calculator',
    name: 'AttGN#3 Calculator',
    component: () => import('../views/tools/AttrGN3Calculator.vue'),
  },
  {
    path: '/tools/ultima-calculator',
    name: 'Ultima Calculator',
    component: () => import('../views/tools/UltimaCalculator.vue'),
  },
  {
    path: '/tools/inscryption-planner',
    name: 'Inscryption Planner',
    component: () => import('../views/tools/InscryptionPlanner.vue'),
  },


  // Settings Route
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue')
  },
  // OAuth Callback Route
  {
    path: '/handler/oauth-callback',
    name: 'OAuthCallback',
    component: () => import('../components/common/OAuthCallback.vue')
  },
  // Stack Auth sign-in route (redirect to home with modal)
  {
    path: '/handler/sign-in',
    name: 'StackSignIn',
    beforeEnter: (to, from, next) => {
      // Redirect to home with sign-in modal triggered
      const returnTo = to.query.after_auth_return_to || '/';
      next({ path: '/', query: { signIn: 'true', returnTo } });
    }
  },
  // Catch all Stack Auth handler routes
  {
    path: '/handler/:pathMatch(.*)*',
    name: 'StackHandlers',
    beforeEnter: (to, from, next) => {
      // If it's the OAuth callback, handle it properly
      if (to.path === '/handler/oauth-callback') {
        next({ name: 'OAuthCallback', query: to.query });
      } else {
        // For any other handler route, redirect to home
        next('/');
      }
    }
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

export default router