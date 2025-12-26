<template>
  <div class="bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700/50">
    <!-- Panel Header with Plan Selector -->
    <div class="bg-gray-700/50 px-3 py-2 border-b border-gray-600 flex items-center justify-between">
      <span class="text-sm font-semibold text-gray-300">Modifiers</span>
      <PlanSelector />
    </div>

    <!-- Tab Navigation (scrollable) -->
    <div class="flex overflow-x-auto no-scrollbar border-b border-gray-700">
      <!-- Gems Tab -->
      <button
        @click="activeTab = 'gems'"
        class="px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2"
        :class="activeTab === 'gems' 
          ? 'text-purple-400 border-purple-500 bg-purple-900/20' 
          : 'text-gray-400 border-transparent hover:text-gray-300'"
      >
        <div class="flex items-center gap-1.5">
          <IconDiamond :size="14" />
          Gems
        </div>
      </button>
      
      <!-- Dynamic Category Tabs -->
      <button
        v-for="category in visibleCategories"
        :key="category.id"
        @click="activeTab = category.id"
        class="px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2"
        :class="activeTab === category.id 
          ? 'text-purple-400 border-purple-500 bg-purple-900/20' 
          : 'text-gray-400 border-transparent hover:text-gray-300'"
      >
        {{ category.label }}
      </button>
      
      <!-- Settings Tab -->
      <button
        @click="activeTab = 'settings'"
        class="px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2"
        :class="activeTab === 'settings' 
          ? 'text-purple-400 border-purple-500 bg-purple-900/20' 
          : 'text-gray-400 border-transparent hover:text-gray-300'"
      >
        <div class="flex items-center gap-1.5">
          <IconSettings :size="14" />
          Settings
        </div>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="p-3">
      <GemsTab v-if="activeTab === 'gems'" />
      <BoostCategoryTab 
        v-else-if="activeCategory"
        :boosts="activeCategory.boosts" 
      />
      <SettingsTab v-else-if="activeTab === 'settings'" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IconDiamond, IconSettings } from '@tabler/icons-vue';

// Components
import PlanSelector from './PlanSelector.vue';
import GemsTab from './tabs/GemsTab.vue';
import BoostCategoryTab from './tabs/BoostCategoryTab.vue';
import SettingsTab from './tabs/SettingsTab.vue';

// Constants
import { boostsByCategory } from '../constants/boosts';

const activeTab = ref('gems');

// Filter categories that have boosts
const visibleCategories = computed(() => {
  return boostsByCategory.filter(cat => cat.boosts.length > 0);
});

// Get active category for dynamic content
const activeCategory = computed(() => {
  return visibleCategories.value.find(cat => cat.id === activeTab.value);
});
</script>
