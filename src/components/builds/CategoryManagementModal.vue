<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 flex justify-between items-center">
        <div>
          <h3 class="text-base font-bold text-white flex items-center">
            <IconFolder size="16" class="mr-2 text-blue-400" />
            Category Management
          </h3>
        </div>
        <button
          @click="closeModal"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="16" />
        </button>
      </div>

      <!-- Description -->
      <div class="px-3 py-2 border-b border-gray-700">
        <p class="text-xs text-gray-300 mb-2">Organize your builds into categories for better management. Create sub-categories by selecting a parent category when adding or editing.</p>
        <div class="bg-gray-700/30 rounded-lg p-2 text-xs text-gray-400">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-500 rounded mr-1.5"></div>
              <span><strong>System Categories:</strong> Cannot be edited or deleted</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-purple-500 rounded mr-1.5"></div>
              <span><strong>Custom Categories:</strong> Fully customizable</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-3">
        <!-- System Categories Section -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center">
              <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
              <h4 class="font-medium text-sm text-blue-200">System Categories</h4>
              <span class="text-xs text-gray-400 ml-2">({{ systemCategories.length }})</span>
            </div>
          </div>
          
          <div class="space-y-1 category-tree-system">
            <CategoryTreeItemDraggable
              v-for="category in systemCategories"
              :key="category.id"
              :category="category"
              :hunterId="hunterId"
              :allCategories="allCategories"
              :isSystem="true"
              :depth="0"
              @update="updateCategory"
              @delete="deleteCategory"
              @add-sub="addSubCategory"
            />
          </div>
        </div>

        <!-- Custom Categories Section -->
        <div class="border-t border-gray-700 pt-3">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center">
              <div class="w-1.5 h-5 bg-purple-500 rounded-r mr-2"></div>
              <h4 class="font-medium text-sm text-purple-200">Custom Categories</h4>
              <span class="text-xs text-gray-400 ml-2">({{ rootCustomCategories.length }})</span>
            </div>
            <button
              @click="openAddCategoryForm(null)"
              class="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-md transition-colors flex items-center gap-1 text-xs"
            >
              <IconPlus size="12" />
              Add Category
            </button>
          </div>

          <!-- Custom Categories Tree -->
          <div v-if="rootCustomCategories.length > 0" class="space-y-1 mb-2 category-tree-custom">
            <CategoryTreeItemDraggable
              v-for="category in rootCustomCategories"
              :key="category.id"
              :category="category"
              :hunterId="hunterId"
              :allCategories="allCategories"
              :isSystem="false"
              :depth="0"
              @update="updateCategory"
              @delete="deleteCategory"
              @add-sub="addSubCategory"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-4">
            <IconFolderOff size="32" class="mx-auto text-gray-600 mb-2" />
            <p class="text-gray-400 mb-2 text-xs">No custom categories yet</p>
            <button
              @click="openAddCategoryForm(null)"
              class="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-md transition-colors inline-flex items-center gap-1 text-xs"
            >
              <IconPlus size="12" />
              Add First Category
            </button>
          </div>

          <!-- Add Category Form -->
          <div v-auto-animate="autoAnimateOptions" class="mt-2">
            <div v-if="showAddCategoryForm" class="p-2 border border-gray-700 rounded-md bg-gray-700/30">
            <div class="flex flex-col gap-2">
              <!-- Parent Category Dropdown -->
              <div>
                <label class="text-xs text-gray-400 mb-1 block">Parent Category</label>
                <select
                  v-model="addCategoryParentId"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option :value="null">Top Level (no parent)</option>
                  <optgroup label="System Categories">
                    <option 
                      v-for="category in systemCategories" 
                      :key="category.id" 
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </optgroup>
                  <optgroup label="Custom Categories" v-if="customCategories.length > 0">
                    <option 
                      v-for="category in customCategories" 
                      :key="category.id" 
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </optgroup>
                </select>
              </div>
              
              <div class="flex items-center gap-2">
                <!-- Color Picker -->
                <TailwindColorPicker 
                  :modelValue="newCategoryColor"
                  @update:modelValue="newCategoryColor = $event"
                  class="flex-shrink-0"
                />
                
                <!-- Category Name -->
                <input
                  v-model="newCategoryName"
                  type="text"
                  placeholder="Category name"
                  class="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-xs"
                  @keyup.enter="addCategory"
                  @keyup.escape="cancelAddCategory"
                  ref="categoryNameInput"
                />
              </div>
              
              <!-- Buttons -->
              <div class="flex gap-1 justify-end">
                <button
                  @click="addCategory"
                  :disabled="!newCategoryName.trim()"
                  class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded transition-colors text-xs"
                >
                  Add
                </button>
                <button
                  @click="cancelAddCategory"
                  class="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition-colors text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="p-2 bg-gray-700/30 rounded-md">
          <p class="text-xs text-gray-300">
            <strong>{{ systemCategories.length }} system categories</strong> and 
            <strong>{{ customCategories.length }} custom categories</strong> available.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end pt-2 border-t border-gray-700 px-3 pb-3">
        <button
          @click="closeModal"
          class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
        >
          Done
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog
      :isVisible="showDeleteAlert"
      title="Delete Category"
      :message="deleteAlertMessage"
      type="warning"
      :showCancel="true"
      confirmText="Delete"
      cancelText="Cancel"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { IconX, IconFolder, IconPlus, IconFolderOff } from '@tabler/icons-vue';
import CategoryTreeItemDraggable from './CategoryTreeItemDraggable.vue';
import TailwindColorPicker from '@/components/common/TailwindColorPicker.vue';
import AlertDialog from '@/components/common/AlertDialog.vue';
import { vAutoAnimate } from '@formkit/auto-animate/vue';

// Auto-animate options
const autoAnimateOptions = {
  duration: 400,
  easing: 'cubic-bezier(0.2, 0, 0.2, 1)'  // Material Design easing
};

// Generic smooth transition wrapper
function withSmoothTransition(updateFn) {
  if (document.startViewTransition) {
    document.documentElement.classList.add('in-page-transition');
    const transition = document.startViewTransition(() => {
      updateFn();
    });
    transition.finished.finally(() => {
      document.documentElement.classList.remove('in-page-transition');
    });
  } else {
    updateFn();
  }
}

const props = defineProps({
  show: Boolean,
  hunterId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const hunterStore = useHunterStore();

// Local state
const newCategoryName = ref('');
const newCategoryColor = ref('blue');
const showAddCategoryForm = ref(false);
const addCategoryParentId = ref(null);
const categoryNameInput = ref(null);

// Alert Dialog state
const showDeleteAlert = ref(false);
const deleteAlertMessage = ref('');
const categoryToDelete = ref(null);

// Computed properties
const allCategories = computed(() => {
  return hunterStore.getCategories(props.hunterId);
});

const systemCategories = computed(() => {
  return allCategories.value.filter(c => c.isSystem && !c.parentId);
});

const customCategories = computed(() => {
  return allCategories.value.filter(c => !c.isSystem);
});

const rootCustomCategories = computed(() => {
  return customCategories.value.filter(c => !c.parentId);
});

// Get build count for a category
function getCategoryBuildCount(categoryId) {
  const categoryBuilds = hunterStore.getBuildsByCategory(props.hunterId, categoryId, false);
  return categoryBuilds.length;
}

function getParentCategoryName(parentId) {
  const parent = allCategories.value.find(c => c.id === parentId);
  return parent ? parent.name : '';
}

// Watch for modal open
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Initialize categories when modal opens
    hunterStore.initBuildCategories(props.hunterId);
  }
});

// Methods
function openAddCategoryForm(parentId = null) {
  addCategoryParentId.value = parentId;
  showAddCategoryForm.value = true;
  
  // Focus input after opening form
  nextTick(() => {
    categoryNameInput.value?.focus();
  });
}

function addSubCategory(parentId) {
  openAddCategoryForm(parentId);
}

function addCategory() {
  if (!newCategoryName.value.trim()) return;

  const categoryName = newCategoryName.value.trim();
  const categoryColor = newCategoryColor.value;
  const categoryParentId = addCategoryParentId.value;

  withSmoothTransition(() => {
    hunterStore.createCategory(props.hunterId, {
      name: categoryName,
      color: categoryColor,
      parentId: categoryParentId
    });
  });

  // Reset form
  newCategoryName.value = '';
  newCategoryColor.value = 'blue';
  showAddCategoryForm.value = false;
  addCategoryParentId.value = null;
}

function updateCategory(categoryData) {
  const { id, name, color, parentId } = categoryData;
  
  withSmoothTransition(() => {
    hunterStore.updateCategory(props.hunterId, id, { name, color, parentId });
  });
}

function deleteCategory(categoryId) {
  // Get sub-categories
  const subCategories = hunterStore.getSubCategories(props.hunterId, categoryId);
  
  categoryToDelete.value = categoryId;
  
  if (subCategories.length > 0) {
    deleteAlertMessage.value = `This category has ${subCategories.length} sub-categor${subCategories.length === 1 ? 'y' : 'ies'}. All will be deleted and builds moved to "Active". Continue?`;
  } else {
    deleteAlertMessage.value = 'Are you sure you want to delete this category? All builds in this category will be moved to "Active".';
  }
  
  showDeleteAlert.value = true;
}

function confirmDelete() {
  if (categoryToDelete.value) {
    const categoryId = categoryToDelete.value;
    
    // Reset dialog state first
    showDeleteAlert.value = false;
    categoryToDelete.value = null;
    
    // Then delete with transition
    withSmoothTransition(() => {
      hunterStore.deleteCategory(props.hunterId, categoryId);
    });
  } else {
    showDeleteAlert.value = false;
  }
}

function cancelDelete() {
  showDeleteAlert.value = false;
  categoryToDelete.value = null;
}

function cancelAddCategory() {
  newCategoryName.value = '';
  newCategoryColor.value = 'blue';
  showAddCategoryForm.value = false;
  addCategoryParentId.value = null;
}

function closeModal() {
  cancelAddCategory();
  emit('close');
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

/* View Transition Names für isolierte Animationen */
.category-tree-system {
  view-transition-name: category-tree-system;
}

.category-tree-custom {
  view-transition-name: category-tree-custom;
}
</style>
