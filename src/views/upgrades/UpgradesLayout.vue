<template>
  <div class="flex min-h-[calc(100vh-64px)]">
    <UpgradesSidebar />

    <!-- Content Area -->
    <div class="flex-1 min-w-0">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { NAVIGATION } from '@/constants/navigation';
import { useStorage } from '@vueuse/core';
import UpgradesSidebar from '@/components/common/UpgradesSidebar.vue';

const route = useRoute();
const router = useRouter();
const gemPlannerStore = useGemPlannerStore();

// Letzten besuchten Tab in localStorage merken
const lastUpgradeTab = useStorage('lastUpgradeTab', '/upgrades/relics');

// Alle verfügbaren Pfade (für Redirect-Validierung)
const availablePaths = (() => {
  const paths = [];
  NAVIGATION.upgradeCategories.forEach(category => {
    category.links.forEach(link => {
      if (!link.unlock_gem || !link.unlock_lvl) {
        paths.push(link.path);
        return;
      }
      const gemState = gemPlannerStore.getGemState(link.unlock_gem);
      if (!gemState || gemState.level < link.unlock_lvl) return;
      if (link.unlock_node !== undefined) {
        const nodeIndex = link.unlock_node - 1;
        if (!gemState.nodes || !gemState.nodes[nodeIndex]) return;
      }
      paths.push(link.path);
    });
  });
  return paths;
})();

// Bei Route-Änderung den aktiven Tab speichern
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/upgrades/') && newPath !== '/upgrades' && newPath !== '/upgrades/gems') {
    lastUpgradeTab.value = newPath;
  }
});

// Redirect /upgrades zum letzten Tab
watch(() => route.path, (newPath) => {
  if (newPath === '/upgrades') {
    const target = availablePaths.includes(lastUpgradeTab.value) 
      ? lastUpgradeTab.value 
      : availablePaths[0] || '/upgrades/relics';
    router.replace(target);
  }
}, { immediate: true });
</script>
