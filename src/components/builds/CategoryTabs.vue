<!-- CategoryTabs.vue - Tab-basierte Kategorie-Ansicht mit Drag-to-Tab -->
<template>
  <div class="category-tabs-container">
    <!-- Category Tabs Header -->
    <div class="tabs-header bg-gray-900/50 rounded-t-lg border border-gray-700 border-b-0">
      <div class="flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <!-- Category Tabs -->
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category.id)"
          :class="[
            'tab-button flex-shrink-0 px-4 py-3 flex items-center gap-2 border-b-2 transition-all',
            activeCategory === category.id
              ? `border-${category.color}-500 bg-${category.color}-900/20 text-white`
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          ]"
          :data-category-id="category.id"
          @dragover.prevent="onTabDragOver(category.id)"
          @dragleave="onTabDragLeave(category.id)"
          @drop="onTabDrop($event, category.id)"
        >
          <IconFolder 
            size="16" 
            :class="activeCategory === category.id ? `text-${category.color}-400` : 'text-gray-500'"
          />
          <span class="text-sm font-medium">{{ category.name }}</span>
          <span 
            v-if="getCategoryBuildsCount(category.id) > 0"
            :class="[
              'px-2 py-0.5 text-xs rounded-full',
              activeCategory === category.id
                ? `bg-${category.color}-500/30 text-${category.color}-300`
                : 'bg-gray-700 text-gray-400'
            ]"
          >
            {{ getCategoryBuildsCount(category.id) }}
          </span>
          
          <!-- Drop indicator -->
          <div
            v-if="dragOverTab === category.id"
            class="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-t-lg pointer-events-none"
          />
        </button>

        <!-- Settings Button -->
        <button
          @click="emit('open-settings')"
          class="tab-button flex-shrink-0 px-4 py-3 flex items-center gap-2 border-b-2 border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 ml-auto"
          title="Manage Categories"
        >
          <IconSettings size="16" />
          <span class="text-sm font-medium hidden sm:inline">Settings</span>
        </button>
      </div>
    </div>

    <!-- Sub-Category Tabs (if available) -->
    <div 
      v-if="subCategories.length > 0"
      class="sub-tabs-header bg-gray-800/30 border-x border-gray-700"
    >
      <div class="flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 px-2">
        <button
          v-for="subCategory in subCategories"
          :key="subCategory.id"
          @click="selectSubCategory(subCategory.id)"
          :class="[
            'tab-button flex-shrink-0 px-3 py-2 flex items-center gap-2 border-b-2 transition-all text-sm',
            activeSubCategory === subCategory.id
              ? `border-${subCategory.color}-500 bg-${subCategory.color}-900/20 text-white`
              : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
          ]"
          :data-category-id="subCategory.id"
          @dragover.prevent="onTabDragOver(subCategory.id)"
          @dragleave="onTabDragLeave(subCategory.id)"
          @drop="onTabDrop($event, subCategory.id)"
        >
          <IconFolderOpen 
            v-if="activeSubCategory === subCategory.id"
            size="14" 
            :class="`text-${subCategory.color}-400`"
          />
          <IconFolder 
            v-else
            size="14" 
            class="text-gray-600"
          />
          <span class="font-medium">{{ subCategory.name }}</span>
          <span 
            v-if="getCategoryBuildsCount(subCategory.id) > 0"
            :class="[
              'px-1.5 py-0.5 text-xs rounded-full',
              activeSubCategory === subCategory.id
                ? `bg-${subCategory.color}-500/30 text-${subCategory.color}-300`
                : 'bg-gray-700 text-gray-500'
            ]"
          >
            {{ getCategoryBuildsCount(subCategory.id) }}
          </span>
          
          <!-- Drop indicator -->
          <div
            v-if="dragOverTab === subCategory.id"
            class="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-t-lg pointer-events-none"
          />
        </button>
      </div>
    </div>

    <!-- Active Category Content -->
    <div class="category-content bg-gray-900/30 rounded-b-lg border border-gray-700 border-t-0 p-4">
      <CategoryView
        v-if="displayCategory"
        :category="displayCategory"
        :hunterId="hunterId"
        :builds="categoryBuilds"
        :subCategories="[]"
        :referenceBuildId="categoryReferenceBuildId"
        :referenceResults="referenceResults"
        :evaluationResults="evaluationResults"
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
        @update-build="emit('update-build', $event)"
      />

      <!-- Empty State -->
      <div v-else class="text-center py-12 text-gray-500">
        <IconInbox size="48" class="mx-auto mb-3 opacity-50" />
        <p class="text-sm">No category selected</p>
      </div>
    </div>

    <!-- Drag Helper Tooltip -->
    <Transition name="fade">
      <div
        v-if="isDragging"
        class="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-lg pointer-events-none z-50"
      >
        💡 Drag to a tab to move build to that category
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import CategoryView from './CategoryView.vue';
import {
  IconFolder,
  IconFolderOpen,
  IconSettings,
  IconInbox
} from '@tabler/icons-vue';

const props = defineProps({
  hunterId: {
    type: String,
    required: true
  },
  categories: {
    type: Array,
    required: true
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
  'set-reference',
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
  'reevaluate',
  'update-build',
  'open-settings'
]);

const hunterStore = useHunterStore();

// Active category state
const activeCategory = ref(null);
const activeSubCategory = ref(null);
const dragOverTab = ref(null);
const isDragging = ref(false);

// Select first category on mount
onMounted(() => {
  if (props.categories.length > 0) {
    activeCategory.value = props.categories[0].id;
    // Don't auto-select subcategory - show main category first
    activeSubCategory.value = null;
  }
});

// Watch for category changes
watch(() => props.categories, (newCategories) => {
  if (newCategories.length > 0 && !activeCategory.value) {
    activeCategory.value = newCategories[0].id;
  }
  // If active category was deleted, select first available
  if (activeCategory.value && !newCategories.find(c => c.id === activeCategory.value)) {
    activeCategory.value = newCategories[0]?.id || null;
    activeSubCategory.value = null;
  }
}, { immediate: true });

// Computed
const activeCategoryData = computed(() => {
  return props.categories.find(c => c.id === activeCategory.value) || null;
});

const subCategories = computed(() => {
  if (!activeCategory.value) return [];
  return getSubCategoriesFor(activeCategory.value);
});

const activeSubCategoryData = computed(() => {
  if (!activeSubCategory.value) return null;
  return subCategories.value.find(c => c.id === activeSubCategory.value) || null;
});

const categoryBuilds = computed(() => {
  // If subcategory is selected, show only subcategory builds
  if (activeSubCategory.value) {
    return hunterStore.getBuildsByCategory(props.hunterId, activeSubCategory.value, false);
  }
  // If main category has subcategories but no subcategory is selected, show main category builds only
  if (activeCategory.value && subCategories.value.length > 0) {
    // Show only builds that are directly in the main category (not in subcategories)
    return hunterStore.getBuildsByCategory(props.hunterId, activeCategory.value, false);
  }
  // Otherwise show main category builds (including all subcategory builds)
  if (!activeCategory.value) return [];
  return hunterStore.getBuildsByCategory(props.hunterId, activeCategory.value, true);
});

const displayCategory = computed(() => {
  return activeSubCategoryData.value || activeCategoryData.value;
});

const currentCategoryId = computed(() => {
  return activeSubCategory.value || activeCategory.value;
});

const categoryReferenceBuildId = computed(() => {
  if (!currentCategoryId.value) return null;
  // Immer der erste Build der Kategorie
  const builds = categoryBuilds.value;
  return builds.length > 0 ? builds[0].id : null;
});

const categoryReferenceBuildData = computed(() => {
  if (!categoryReferenceBuildId.value) return null;
  return hunterStore.getBuildById(props.hunterId, categoryReferenceBuildId.value);
});

// Functions
function selectCategory(categoryId) {
  activeCategory.value = categoryId;
  // Don't auto-select first subcategory - show main category builds first
  activeSubCategory.value = null;
}

function selectSubCategory(subCategoryId) {
  activeSubCategory.value = subCategoryId;
}

function getSubCategoriesFor(parentId) {
  const allCategories = hunterStore.getCategories(props.hunterId);
  return allCategories.filter(c => c.parentId === parentId);
}

function getCategoryBuildsCount(categoryId) {
  return hunterStore.getBuildsByCategory(props.hunterId, categoryId, false).length;
}

// Drag to Tab functionality
function onTabDragOver(categoryId) {
  dragOverTab.value = categoryId;
  isDragging.value = true;
}

function onTabDragLeave(categoryId) {
  if (dragOverTab.value === categoryId) {
    dragOverTab.value = null;
  }
}

function onTabDrop(event, categoryId) {
  event.preventDefault();
  dragOverTab.value = null;
  isDragging.value = false;
  
  // Get build ID from drag data
  const buildId = event.dataTransfer.getData('buildId');
  
  if (buildId && categoryId !== activeCategory.value) {
    console.log(`📦 Dropping build ${buildId} onto tab "${categoryId}"`);
    hunterStore.moveBuildToCategory(props.hunterId, buildId, categoryId);
    
    emit('build-moved', {
      buildId,
      categoryId
    });
  }
}

// Listen for drag start from CategoryView
onMounted(() => {
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('dragend', handleDragEnd);
});

function handleDragStart(event) {
  // Check if it's a build being dragged
  const buildItem = event.target.closest('[data-build-id]');
  if (buildItem) {
    const buildId = buildItem.dataset.buildId;
    event.dataTransfer.setData('buildId', buildId);
    isDragging.value = true;
  }
}

function handleDragEnd() {
  isDragging.value = false;
  dragOverTab.value = null;
}
</script>

<style scoped>
.category-tabs-container {
  position: relative;
}

.tabs-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.sub-tabs-header {
  position: sticky;
  top: 49px; /* Height of main tabs */
  z-index: 9;
}

.tab-button {
  position: relative;
  white-space: nowrap;
}

/* Smooth scrollbar for tabs */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #1f2937;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
