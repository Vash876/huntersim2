<template>
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
          >
            <component 
              :is="link.icon" 
              class="w-4 h-4 flex-shrink-0" 
              :class="isActive(link.path) ? 'text-blue-400' : 'text-gray-500'" 
            />
            <span>{{ link.label }}{{ getLinkSuffix(link) }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Dismissible hint -->
    <div v-if="showHint && !hintDismissed" class="mx-2 mt-3 mb-1 p-2 bg-teal-900/40 border border-teal-700/50 rounded-lg text-[11px] text-teal-300 leading-snug relative">
      <button @click="dismissHint" class="absolute top-1 right-1 p-0.5 rounded hover:bg-teal-800/50 transition-colors text-teal-400 hover:text-teal-200">
        <IconX :size="12" />
      </button>
      <p class="pr-4">You can disable this sidebar in <strong>Settings → Interface</strong> if you need more screen space.</p>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useHunterStore } from '@/store/hunterStore';
import { NAVIGATION } from '@/constants/navigation';
import { getUpgrades } from '@/utils/upgradeUtils';
import { IconStarFilled, IconX } from '@tabler/icons-vue';

const props = defineProps({
  showHint: { type: Boolean, default: false }
});

const route = useRoute();
const gemPlannerStore = useGemPlannerStore();
const hunterStore = useHunterStore();

// Dismissible hint state
const hintDismissed = ref(localStorage.getItem('huntersim_sidebar_hint_dismissed') === 'true');

function dismissHint() {
  hintDismissed.value = true;
  localStorage.setItem('huntersim_sidebar_hint_dismissed', 'true');
}

// Pfad → Store-Kategorie Mapping (automatisch aus navigation.js generiert)
const PATH_TO_CATEGORY = Object.fromEntries(
  NAVIGATION.upgradeCategories
    .flatMap(cat => cat.links)
    .map(link => [link.path, link.path.split('/').pop()])
);

const NO_MAX_THRESHOLD = 1000;

const STATIC_MAX_VALUES = {
  'ulti': 10,
};

function isPathMaxed(path) {
  const storeCategory = PATH_TO_CATEGORY[path];
  if (!storeCategory) return false;
  
  const items = getUpgrades(storeCategory);
  if (!items || items.length === 0) return false;
  
  return items.every(item => {
    const value = hunterStore.getUpgradeValue(storeCategory, item.id);
    
    if (item.type === 'boolean') return value > 0;
    if (item.type === 'static' && STATIC_MAX_VALUES[item.id] !== undefined) return value >= STATIC_MAX_VALUES[item.id];
    if (item.maxLevel !== undefined && item.maxLevel !== Infinity) return value >= item.maxLevel;
    return value >= NO_MAX_THRESHOLD;
  });
}

function isCategoryMaxed(category) {
  return category.links.every(link => isPathMaxed(link.path));
}

// Gem-basierter Filter
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

function isActive(path) {
  return route.path === path;
}

function getLinkSuffix(link) {
  if (link.path === '/upgrades/shardmilestones') {
    const lvl = hunterStore.getUpgradeValue('shardmilestones', 'm0') || 0;
    return ` (${lvl})`;
  }
  return '';
}
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
