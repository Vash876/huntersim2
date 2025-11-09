<!-- CategoryView.vue - Rekursive Kategorie-Ansicht mit Fluid DnD -->
<template>
  <div class="category-view">
    <!-- Category Header -->
    <div 
      class="category-header flex items-center justify-between px-3 py-2 rounded-t-lg border-b"
      :class="getCategoryHeaderClass(category.color)"
    >
      <div class="flex items-center gap-2">
        <IconFolder size="16" :class="`text-${category.color}-400`" />
        <h4 class="text-sm font-semibold text-white">{{ category.name }}</h4>
        <span class="text-xs text-gray-400">({{ builds.length }})</span>
      </div>

      <div class="flex items-center gap-1">
        <button
          @click.stop="emit('add-subcategory', category.id)"
          class="p-1 rounded hover:bg-gray-700/50 transition-colors"
          title="Add Subcategory"
        >
          <IconFolderPlus size="14" class="text-gray-400 hover:text-green-400" />
        </button>
        <button
          v-if="!category.isSystem"
          @click.stop="emit('edit-category', category.id)"
          class="p-1 rounded hover:bg-gray-700/50 transition-colors"
          title="Edit Category"
        >
          <IconEdit size="14" class="text-gray-400 hover:text-blue-400" />
        </button>
        <button
          v-if="!category.isSystem"
          @click.stop="emit('delete-category', category.id)"
          class="p-1 rounded hover:bg-gray-700/50 transition-colors"
          title="Delete Category"
        >
          <IconTrash size="14" class="text-gray-400 hover:text-red-400" />
        </button>
      </div>
    </div>

    <!-- Builds Grid mit vuedraggable -->
    <div class="builds-container p-2 min-h-[100px] bg-gray-900/30 rounded-b-lg">
      <Draggable
        v-model="localBuilds"
        :group="'build-categories'"
        handle=".grip-handle"
        :animation="200"
        item-key="id"
        class="builds-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        @change="onChange"
        @end="onDragEnd"
      >
        <template #item="{ element: build, index }">
          <div :data-build-id="build.id" class="build-item">
            <BuildCardVertical
              :build-id="build.id"
              :hunter-id="hunterId"
              :name="build.name"
              :level="build.level"
              :results="evaluationResults[build.id]?.results"
              :is-loading="evaluationResults[build.id]?.isLoading"
              :is-reference-build="index === 0"
              :reference-results="referenceResults"
              :auto-evaluate="true"
              :index="index"
              @edit="emit('edit-build', build.id)"
              @clone="emit('clone-build', build.id)"
              @archive="emit('archive-build', build.id)"
              @delete="emit('delete-build', build.id)"
              @name-changed="emit('name-changed', $event)"
              @overrides-build="emit('overrides-build', $event)"
              @evaluated="emit('build-evaluated', $event)"
              @reevaluate="emit('reevaluate', build.id)"
            />
          </div>
        </template>
      </Draggable>

      <!-- Empty State -->
      <div 
        v-if="localBuilds.length === 0" 
        class="flex flex-col items-center justify-center py-8 text-gray-500"
      >
        <IconInbox size="32" class="mb-2 opacity-50" />
        <p class="text-xs">No builds in this category</p>
        <p class="text-xs text-gray-600">Drag builds here</p>
      </div>
    </div>

    <!-- Sub-Categories (Rekursiv) -->
    <div v-if="subCategories.length > 0" class="sub-categories mt-3 ml-4 space-y-2 border-l-2 border-gray-700 pl-3">
      <CategoryView
        v-for="subCat in subCategories"
        :key="subCat.id"
        :category="subCat"
        :hunter-id="hunterId"
        :builds="getBuildsForCategory(subCat.id)"
        :sub-categories="getSubCategoriesFor(subCat.id)"
        :reference-build-id="referenceBuildId"
        :reference-results="referenceResults"
        :evaluation-results="evaluationResults"
        @set-reference="emit('set-reference', $event)"
        @edit-build="emit('edit-build', $event)"
        @clone-build="emit('clone-build', $event)"
        @archive-build="emit('archive-build', $event)"
        @delete-build="emit('delete-build', $event)"
        @name-changed="emit('name-changed', $event)"
        @overrides-build="emit('overrides-build', $event)"
        @add-subcategory="emit('add-subcategory', $event)"
        @edit-category="emit('edit-category', $event)"
        @delete-category="emit('delete-category', $event)"
        @build-moved="emit('build-moved', $event)"
        @build-evaluated="emit('build-evaluated', $event)"
        @reevaluate="emit('reevaluate', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import Draggable from 'vuedraggable';
import { useHunterStore } from '@/store/hunterStore';
import BuildCardVertical from './Views/verticalView/BuildCardVertical.vue';
import {
  IconFolder,
  IconFolderPlus,
  IconEdit,
  IconTrash,
  IconInbox
} from '@tabler/icons-vue';

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  hunterId: {
    type: String,
    required: true
  },
  builds: {
    type: Array,
    required: true
  },
  subCategories: {
    type: Array,
    default: () => []
  },
  referenceBuildId: {
    type: String,
    default: null
  },
  referenceResults: {
    type: Object,
    default: null
  },
  evaluationResults: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits([
  'edit-build',
  'clone-build',
  'archive-build',
  'delete-build',
  'name-changed',
  'overrides-build',
  'add-subcategory',
  'edit-category',
  'delete-category',
  'build-moved',
  'build-evaluated',
  'reevaluate'
]);

const hunterStore = useHunterStore();

// Local builds list for vuedraggable
const localBuilds = ref([]);

// Flag to prevent watch loops during drag operations
const isDragging = ref(false);

// Sync props.builds with localBuilds (only when not dragging)
watch(() => props.builds, (newBuilds) => {
  if (!isDragging.value) {
    localBuilds.value = [...newBuilds];
  }
}, { immediate: true, deep: true });

// Handle drag change (add/remove from category)
function onChange(event) {
  isDragging.value = true;
  
  console.log('📦 Drag Change Event:', {
    added: event.added,
    removed: event.removed,
    moved: event.moved,
    category: props.category.name
  });
  
  // Handle build added to this category
  if (event.added) {
    const build = event.added.element;
    console.log(`📦 Build "${build.name}" added to category "${props.category.name}"`);
    hunterStore.moveBuildToCategory(props.hunterId, build.id, props.category.id);
  }
  
  // Handle build removed from this category (moved to another)
  if (event.removed) {
    const build = event.removed.element;
    console.log(`📦 Build "${build.name}" removed from category "${props.category.name}"`);
  }
  
  // Handle build moved within same category (reorder)
  if (event.moved) {
    const build = event.moved.element;
    console.log(`📦 Build "${build.name}" reordered in category "${props.category.name}"`);
    // Update order in store
    localBuilds.value.forEach((b, index) => {
      hunterStore.moveBuildToCategory(props.hunterId, b.id, props.category.id);
    });
  }
  
  emit('build-moved', {
    categoryId: props.category.id,
    buildIds: localBuilds.value.map(b => b.id)
  });
  
  // Reset dragging flag after a short delay
  setTimeout(() => {
    isDragging.value = false;
  }, 100);
}

// Handle drag end - update store with new order/category
function onDragEnd(event) {
  console.log('📦 Drag End Event:', event);
  
  // Get the build that was moved
  const movedBuild = localBuilds.value[event.newIndex];
  
  if (!movedBuild) {
    console.warn('⚠️ No build found at index', event.newIndex);
    return;
  }
  
  console.log(`📦 Build "${movedBuild.name}" moved to category "${props.category.name}"`);
  
  // Update store with new build order for this category
  localBuilds.value.forEach((build, index) => {
    hunterStore.moveBuildToCategory(props.hunterId, build.id, props.category.id);
  });
  
  emit('build-moved', {
    categoryId: props.category.id,
    buildId: movedBuild.id,
    buildIds: localBuilds.value.map(b => b.id)
  });
}

// Helper Functions
function getBuildsForCategory(categoryId) {
  return hunterStore.getBuildsByCategory(props.hunterId, categoryId, false);
}

function getSubCategoriesFor(parentId) {
  const allCategories = hunterStore.getCategories(props.hunterId);
  return allCategories.filter(c => c.parentId === parentId);
}

function getCategoryHeaderClass(color) {
  const colorMap = {
    blue: 'bg-gradient-to-r from-blue-900/30 to-gray-800 border-blue-700/50',
    green: 'bg-gradient-to-r from-green-900/30 to-gray-800 border-green-700/50',
    purple: 'bg-gradient-to-r from-purple-900/30 to-gray-800 border-purple-700/50',
    red: 'bg-gradient-to-r from-red-900/30 to-gray-800 border-red-700/50',
    yellow: 'bg-gradient-to-r from-yellow-900/30 to-gray-800 border-yellow-700/50',
    pink: 'bg-gradient-to-r from-pink-900/30 to-gray-800 border-pink-700/50',
    orange: 'bg-gradient-to-r from-orange-900/30 to-gray-800 border-orange-700/50',
    gray: 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
  };
  return colorMap[color] || colorMap.gray;
}
</script>

<style scoped>
.category-view {
  transition: all 0.2s ease;
}

.builds-container {
  position: relative;
}

.builds-grid {
  list-style: none;
}

.build-item {
  display: flex;
  flex-direction: column;
}

/* Vuedraggable ghost/drag states */
.sortable-ghost {
  opacity: 0.4;
}

.sortable-drag {
  opacity: 0.8;
}

.sub-categories {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

