<template>
  <div class="flex min-h-[calc(100vh-64px)]">
    <!-- Sidebar Navigation (nur Desktop) -->
    <aside class="hidden md:flex flex-col w-52 flex-shrink-0 bg-gray-900/90 border-r border-gray-700/40 sticky top-0 h-screen overflow-y-auto scrollbar-hide">
      <div class="py-4 px-3 space-y-5">
        <div v-for="category in filteredCategories" :key="category.name">
          <!-- Category Header -->
          <h3 class="text-[12px] font-semibold uppercase tracking-wider text-gray-500 px-2.5 mb-1.5 flex items-center gap-1.5">
            {{ category.name }}
            <template v-if="isCategoryMaxed(category) && category.name === 'Premium'">
              <IconStarFilled class="w-3 h-3 text-amber-400" />
              <span class="text-[7.5px] text-amber-400 font-bold tracking-widest">MAXED</span>
            </template>
          </h3>
          
          <!-- Category Links -->
          <div class="space-y-0.5">
            <router-link
              v-for="link in category.links"
              :key="link.path"
              :to="link.path"
              class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200"
              :class="[
                isActive(link.path)
                  ? 'bg-blue-600/20 text-blue-300 shadow-sm shadow-blue-500/5'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              ]"
              @click="saveLastTab(link.path)"
            >
              <component 
                :is="link.icon" 
                class="w-4 h-4 flex-shrink-0" 
                :class="isActive(link.path) ? 'text-blue-400' : 'text-gray-500'" 
              />
              <span>{{ link.label }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </aside>

    <!-- Content Area -->
    <div class="flex-1 min-w-0">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useHunterStore } from '@/store/hunterStore';
import { NAVIGATION } from '@/constants/navigation';
import { getUpgrades } from '@/utils/upgradeUtils';
import { IconStarFilled } from '@tabler/icons-vue';
import { useStorage } from '@vueuse/core';

const route = useRoute();
const router = useRouter();
const gemPlannerStore = useGemPlannerStore();
const hunterStore = useHunterStore();

// Pfad → Store-Kategorie Mapping
const PATH_TO_CATEGORY = {
  '/upgrades/relics': 'relics',
  '/upgrades/researches': 'researches',
  '/upgrades/gadgets': 'gadgets',
  '/upgrades/inscryptions': 'inscryptions',
  '/upgrades/loopmods': 'loopmods',
  '/upgrades/milestones': 'shardmilestones',
  '/upgrades/cms': 'cms',
  '/upgrades/trinkets': 'trinkets',
  '/upgrades/ultima': 'ultima',
  '/upgrades/diamondspecials': 'diamondspecials',
  '/upgrades/diamondcards': 'diamondcards',
  '/upgrades/iap': 'iap',
};

// Threshold für Upgrades ohne maxLevel (Infinity/undefined)
const NO_MAX_THRESHOLD = 1000;

// Spezielle Max-Werte für Upgrades mit type "static" (z.B. Ultima)
const STATIC_MAX_VALUES = {
  'ulti': 3.4476,
};

/**
 * Prüft ob alle Upgrades eines Pfades maxed sind
 * - Boolean-Upgrades: maxed wenn value > 0
 * - Static-Upgrades: maxed wenn value >= definierter Max-Wert
 * - Level-Upgrades mit maxLevel: maxed wenn value >= maxLevel
 * - Level-Upgrades ohne maxLevel (Infinity): maxed wenn value >= 1000
 */
function isPathMaxed(path) {
  const storeCategory = PATH_TO_CATEGORY[path];
  if (!storeCategory) return false;
  
  const items = getUpgrades(storeCategory);
  if (!items || items.length === 0) return false;
  
  return items.every(item => {
    const value = hunterStore.getUpgradeValue(storeCategory, item.id);
    
    if (item.type === 'boolean') {
      return value > 0;
    }
    
    // Static-Upgrades mit bekanntem Max-Wert
    if (item.type === 'static' && STATIC_MAX_VALUES[item.id] !== undefined) {
      return value >= STATIC_MAX_VALUES[item.id];
    }
    
    if (item.maxLevel !== undefined && item.maxLevel !== Infinity) {
      return value >= item.maxLevel;
    }
    
    // Kein maxLevel oder Infinity → Threshold 1000
    return value >= NO_MAX_THRESHOLD;
  });
}

/**
 * Prüft ob alle Links einer Kategorie-Gruppe maxed sind
 */
function isCategoryMaxed(category) {
  return category.links.every(link => isPathMaxed(link.path));
}

/**
 * Easter Egg: Alle Upgrade-Kategorien vollständig maxed
 */
const allMaxed = computed(() => {
  return filteredCategories.value.every(cat => isCategoryMaxed(cat));
});

// Letzten besuchten Tab in localStorage merken
const lastUpgradeTab = useStorage('lastUpgradeTab', '/upgrades/relics');

// Gem-basierter Filter (gleiche Logik wie in Navbar)
const filteredCategories = computed(() => {
  return NAVIGATION.upgradeCategories.map(category => ({
    ...category,
    links: category.links.filter(link => {
      if (!link.unlock_gem || !link.unlock_lvl) return true;
      
      const gemState = gemPlannerStore.getGemState(link.unlock_gem);
      if (!gemState) return false;
      if (gemState.level < link.unlock_lvl) return false;
      
      if (link.unlock_node !== undefined) {
        const nodeIndex = link.unlock_node - 1;
        if (!gemState.nodes || !gemState.nodes[nodeIndex]) return false;
      }
      
      return true;
    })
  })).filter(category => category.links.length > 0);
});

// Alle verfügbaren Pfade (für Redirect-Validierung)
const availablePaths = computed(() => {
  return filteredCategories.value.flatMap(cat => cat.links.map(l => l.path));
});

function isActive(path) {
  return route.path === path;
}

function saveLastTab(path) {
  lastUpgradeTab.value = path;
}

// Bei Route-Änderung den aktiven Tab speichern
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/upgrades/') && newPath !== '/upgrades' && newPath !== '/upgrades/gems') {
    lastUpgradeTab.value = newPath;
  }
});

// Redirect /upgrades zum letzten Tab
watch(() => route.path, (newPath) => {
  if (newPath === '/upgrades') {
    const target = availablePaths.value.includes(lastUpgradeTab.value) 
      ? lastUpgradeTab.value 
      : availablePaths.value[0] || '/upgrades/relics';
    router.replace(target);
  }
}, { immediate: true });
</script>

<style scoped>
/* Scrollbar für Tab-Leiste auf Mobile verstecken */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
