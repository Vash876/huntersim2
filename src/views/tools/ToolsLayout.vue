<template>
  <div class="flex min-h-[calc(100vh-64px)]">
    <!-- Sidebar Navigation (nur Desktop) -->
    <aside class="hidden md:flex flex-col w-52 flex-shrink-0 bg-gray-900/90 border-r border-gray-700/40 sticky top-0 h-screen overflow-y-auto scrollbar-hide">
      <div class="py-4 px-3 space-y-5">
        <div v-for="category in filteredToolCategories" :key="category.name">
          <!-- Category Header -->
          <h3 class="text-[12px] font-semibold uppercase tracking-wider text-gray-500 px-2.5 mb-1.5 flex items-center gap-1.5">
            {{ category.name }}
          </h3>
          
          <!-- Category Links -->
          <div class="space-y-0.5">
            <router-link
              v-for="tool in category.tools"
              :key="tool.path"
              :to="tool.path"
              class="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200"
              :class="[
                isActive(tool.path)
                  ? getActiveClasses(tool.color)
                  : getInactiveClasses(tool.color)
              ]"
              @click="saveLastTab(tool.path); tool.isNew && markToolAsSeen(tool.id)"
            >
              <component 
                :is="tool.icon" 
                class="w-4 h-4 flex-shrink-0 transition-colors duration-200" 
                :class="isActive(tool.path) ? getIconActive(tool.color) : getIconInactive(tool.color)" 
              />
              <span>{{ tool.name }}</span>
              <span v-if="tool.isNew && !seenNewTools.includes(tool.id)" class="ml-auto text-[8px] font-bold bg-green-500 text-white px-1 py-0.5 rounded uppercase leading-none">NEW</span>
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
import { NAVIGATION, SECRET_ACCESS_IDS, hasSecretAccessCached } from '@/constants/navigation';
import { useStorage } from '@vueuse/core';
import { neonAuthService } from '@/services/neonAuthService';

const seenNewTools = useStorage('hs2_seen_new_tools', []);

function markToolAsSeen(toolId) {
  if (!seenNewTools.value.includes(toolId)) {
    seenNewTools.value = [...seenNewTools.value, toolId];
  }
}

const route = useRoute();
const router = useRouter();
const gemPlannerStore = useGemPlannerStore();

// Farb-Klassen für jede Tool-Farbe
const colorClasses = {
  red:    { bg: 'bg-red-500/15',    text: 'text-red-300',    shadow: 'shadow-sm shadow-red-500/5',    icon: 'text-red-400',    hoverBg: 'hover:bg-red-500/10',    hoverText: 'hover:text-red-300',    hoverIcon: 'group-hover:text-red-500/60' },
  green:  { bg: 'bg-green-500/15',  text: 'text-green-300',  shadow: 'shadow-sm shadow-green-500/5',  icon: 'text-green-400',  hoverBg: 'hover:bg-green-500/10',  hoverText: 'hover:text-green-300',  hoverIcon: 'group-hover:text-green-500/60' },
  blue:   { bg: 'bg-blue-300/15',   text: 'text-blue-300',   shadow: 'shadow-sm shadow-blue-300/5',   icon: 'text-blue-400',   hoverBg: 'hover:bg-blue-300/10',   hoverText: 'hover:text-blue-300',   hoverIcon: 'group-hover:text-cyan-300/60' },
  purple: { bg: 'bg-purple-500/15', text: 'text-purple-300', shadow: 'shadow-sm shadow-purple-500/5', icon: 'text-purple-400', hoverBg: 'hover:bg-purple-500/10', hoverText: 'hover:text-purple-300', hoverIcon: 'group-hover:text-purple-500/60' },
  cyan:   { bg: 'bg-cyan-500/15',   text: 'text-cyan-300',   shadow: 'shadow-sm shadow-cyan-500/5',   icon: 'text-cyan-400',   hoverBg: 'hover:bg-cyan-500/10',   hoverText: 'hover:text-cyan-300',   hoverIcon: 'group-hover:text-cyan-500/60' },
  amber:  { bg: 'bg-amber-500/15',  text: 'text-amber-300',  shadow: 'shadow-sm shadow-amber-500/5',  icon: 'text-amber-400',  hoverBg: 'hover:bg-amber-500/10',  hoverText: 'hover:text-amber-300',  hoverIcon: 'group-hover:text-amber-500/60' },
  yellow: { bg: 'bg-yellow-500/15', text: 'text-yellow-300', shadow: 'shadow-sm shadow-yellow-500/5', icon: 'text-yellow-400', hoverBg: 'hover:bg-yellow-500/10', hoverText: 'hover:text-yellow-300', hoverIcon: 'group-hover:text-yellow-500/60' },
  orange: { bg: 'bg-orange-500/15', text: 'text-orange-300', shadow: 'shadow-sm shadow-orange-500/5', icon: 'text-orange-400', hoverBg: 'hover:bg-orange-500/10', hoverText: 'hover:text-orange-300', hoverIcon: 'group-hover:text-amber-500/60' },
};

function getActiveClasses(color) {
  const c = colorClasses[color] || colorClasses.blue;
  return [c.bg, c.text, c.shadow];
}

function getInactiveClasses(color) {
  const c = colorClasses[color] || colorClasses.blue;
  return ['text-gray-400', c.hoverBg, c.hoverText];
}

function getIconActive(color) {
  const c = colorClasses[color] || colorClasses.blue;
  return c.icon;
}

function getIconInactive(color) {
  const c = colorClasses[color] || colorClasses.blue;
  return ['text-gray-500', c.hoverIcon];
}

// Letzten besuchten Tab in localStorage merken
const lastToolTab = useStorage('lastToolTab', '/tools/tr-planner');

// Gem-basierter Filter (gleiche Logik wie in Navbar)
const filteredToolCategories = computed(() => {
  const userId = neonAuthService.getUserId();
  const hasSecretAccess = SECRET_ACCESS_IDS.includes(userId) || hasSecretAccessCached();
  
  return NAVIGATION.toolCategories.map(category => {
    // Secret-Kategorien nur für berechtigte User
    if (category.secret && !hasSecretAccess) {
      return { ...category, tools: [] };
    }
    
    return {
      ...category,
      tools: category.tools.filter(tool => {
        if (!tool.unlock || !tool.unlock_lvl) return true;
        
        const gemState = gemPlannerStore.getGemState(tool.unlock);
        if (!gemState) return false;
        if (gemState.level < tool.unlock_lvl) return false;
        
        if (tool.unlock_node !== undefined) {
          const nodeIndex = tool.unlock_node - 1;
          if (!gemState.nodes || !gemState.nodes[nodeIndex]) return false;
        }
        
        return true;
      })
    };
  }).filter(category => category.tools.length > 0);
});

// Alle verfügbaren Pfade (für Redirect-Validierung)
const availablePaths = computed(() => {
  return filteredToolCategories.value.flatMap(cat => cat.tools.map(t => t.path));
});

function isActive(path) {
  return route.path === path;
}

function saveLastTab(path) {
  lastToolTab.value = path;
}

// Bei Route-Änderung den aktiven Tab speichern
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/tools/') && newPath !== '/tools') {
    lastToolTab.value = newPath;
  }
});

// Redirect /tools zum letzten Tab
watch(() => route.path, (newPath) => {
  if (newPath === '/tools') {
    const target = availablePaths.value.includes(lastToolTab.value) 
      ? lastToolTab.value 
      : availablePaths.value[0] || '/tools/tr-planner';
    router.replace(target);
  }
}, { immediate: true });
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
