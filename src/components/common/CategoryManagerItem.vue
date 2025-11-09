<template>
  <div class="category-item">
    <!-- Category Row -->
    <div 
      :class="[
        'flex items-center gap-2 p-2 rounded-md transition-colors',
        category.isSystem ? 'bg-gray-750' : 'bg-gray-700 hover:bg-gray-650'
      ]"
      :style="{ marginLeft: `${level * 20}px` }"
    >
      <!-- Folder Icon with Color -->
      <div 
        :class="`w-6 h-6 rounded flex items-center justify-center bg-${category.color}-600/20`"
      >
        <IconFolder :size="14" :class="`text-${category.color}-400`" />
      </div>

      <!-- Category Name -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-white truncate">
            {{ category.name }}
          </span>
          <span 
            v-if="category.isSystem"
            class="text-xs px-1.5 py-0.5 bg-gray-600 text-gray-300 rounded"
          >
            System
          </span>
        </div>
        <div class="text-xs text-gray-400">
          {{ buildCount }} {{ buildCount === 1 ? 'build' : 'builds' }}
        </div>
      </div>

      <!-- Action Buttons (only for custom categories) -->
      <div v-if="!category.isSystem" class="flex items-center gap-1">
        <button
          @click="$emit('edit', category)"
          class="p-1.5 hover:bg-gray-600 rounded transition-colors"
          title="Edit category"
        >
          <IconEdit :size="14" class="text-blue-400" />
        </button>
        <button
          @click="$emit('delete', category.id)"
          class="p-1.5 hover:bg-gray-600 rounded transition-colors"
          title="Delete category"
        >
          <IconTrash :size="14" class="text-red-400" />
        </button>
      </div>
    </div>

    <!-- Sub-Categories (Recursive) -->
    <div v-if="subCategories.length > 0" class="mt-1">
      <CategoryManagerItem
        v-for="subCategory in subCategories"
        :key="subCategory.id"
        :category="subCategory"
        :all-categories="allCategories"
        :build-counts="buildCounts"
        :level="level + 1"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconFolder, IconEdit, IconTrash } from '@tabler/icons-vue';

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  allCategories: {
    type: Array,
    required: true
  },
  buildCounts: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
});

defineEmits(['edit', 'delete']);

// Get sub-categories of this category
const subCategories = computed(() => {
  return props.allCategories.filter(cat => cat.parentId === props.category.id);
});

// Get build count for this category
const buildCount = computed(() => {
  return props.buildCounts[props.category.id] || 0;
});
</script>

<style scoped>
.category-item {
  position: relative;
}
</style>
