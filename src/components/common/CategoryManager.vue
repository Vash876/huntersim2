<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-lg font-bold text-white flex items-center">
          <IconFolder :size="18" class="mr-2 text-blue-400" />
          Category Manager
        </h2>
        <button @click="closeModal" class="p-1.5 rounded-full hover:bg-gray-700 transition-colors">
          <IconX :size="16" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 max-h-[75vh] overflow-y-auto">
        <!-- Create New Category Form -->
        <div class="bg-gray-700 rounded-lg p-4 mb-4">
          <h3 class="text-sm font-semibold text-white mb-3 flex items-center">
            <IconPlus :size="16" class="mr-2" />
            {{ editingCategory ? 'Edit Category' : 'Create New Category' }}
          </h3>
          
          <div class="space-y-3">
            <!-- Name Input -->
            <div>
              <label class="block text-xs text-gray-300 mb-1">Category Name</label>
              <input
                v-model="newCategoryName"
                type="text"
                placeholder="Enter category name..."
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                @keydown.enter="editingCategory ? saveEdit() : createCategory()"
              />
            </div>

            <!-- Color Picker -->
            <div>
              <label class="block text-xs text-gray-300 mb-1">Color</label>
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="color in availableColors"
                  :key="color"
                  @click="newCategoryColor = color"
                  :class="[
                    'w-10 h-10 rounded-md border-2 transition-all',
                    newCategoryColor === color ? 'border-white scale-110' : 'border-transparent',
                    `bg-${color}-600 hover:scale-105`
                  ]"
                  :title="color"
                />
              </div>
            </div>

            <!-- Parent Category Selector -->
            <div>
              <label class="block text-xs text-gray-300 mb-1">Parent Category (Optional)</label>
              <select
                v-model="newCategoryParentId"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
              >
                <option :value="null">None (Top Level)</option>
                <option
                  v-for="category in selectableCategories"
                  :key="category.id"
                  :value="category.id"
                  :disabled="editingCategory && category.id === editingCategory.id"
                >
                  {{ getIndentedName(category) }}
                </option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 justify-end">
              <button
                v-if="editingCategory"
                @click="cancelEdit"
                class="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm text-white transition-colors"
              >
                Cancel
              </button>
              <button
                @click="editingCategory ? saveEdit() : createCategory()"
                :disabled="!newCategoryName.trim()"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ editingCategory ? 'Save Changes' : 'Create Category' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Categories List -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-white mb-2 flex items-center">
            <IconList :size="16" class="mr-2" />
            All Categories
          </h3>

          <!-- Recursive Category List -->
          <div class="space-y-1">
            <CategoryManagerItem
              v-for="category in topLevelCategories"
              :key="category.id"
              :category="category"
              :all-categories="allCategories"
              :build-counts="buildCounts"
              :level="0"
              @edit="startEdit"
              @delete="deleteCategory"
            />
          </div>

          <!-- Empty State -->
          <div v-if="customCategories.length === 0" class="text-center py-8 text-gray-400">
            <IconInbox :size="48" class="mx-auto mb-2 opacity-50" />
            <p class="text-sm">No custom categories yet</p>
            <p class="text-xs text-gray-500">Create one to organize your builds</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center pt-3 border-t border-gray-700 px-4 pb-4">
        <div class="text-xs text-gray-400">
          {{ customCategories.length }} custom {{ customCategories.length === 1 ? 'category' : 'categories' }}
        </div>
        <button 
          @click="closeModal" 
          class="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div
    v-if="toast.show"
    class="fixed bottom-4 right-4 z-[60] px-4 py-2 rounded-lg shadow-lg text-white text-sm animate-slide-up"
    :class="{
      'bg-green-600': toast.type === 'success',
      'bg-red-600': toast.type === 'error',
      'bg-yellow-600': toast.type === 'warning',
      'bg-blue-600': toast.type === 'info'
    }"
  >
    {{ toast.message }}
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { 
  IconFolder, 
  IconX, 
  IconPlus, 
  IconList,
  IconInbox
} from '@tabler/icons-vue';
import CategoryManagerItem from './CategoryManagerItem.vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  hunterId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'category-updated']);

const hunterStore = useHunterStore();

// Available colors for categories
const availableColors = [
  'blue', 'green', 'purple', 'red', 
  'yellow', 'pink', 'orange', 'gray',
  'teal', 'indigo', 'cyan', 'emerald'
];

// Form state
const newCategoryName = ref('');
const newCategoryColor = ref('blue');
const newCategoryParentId = ref(null);
const editingCategory = ref(null);

// Toast state
const toast = ref({ show: false, message: '', type: 'info' });

// Get all categories for this hunter
const allCategories = computed(() => {
  return hunterStore.getCategories(props.hunterId) || [];
});

// Get custom (non-system) categories
const customCategories = computed(() => {
  return allCategories.value.filter(cat => !cat.isSystem);
});

// Get top-level categories (no parent)
const topLevelCategories = computed(() => {
  return allCategories.value.filter(cat => !cat.parentId);
});

// Categories that can be selected as parents (excluding current editing category and its descendants)
const selectableCategories = computed(() => {
  if (!editingCategory.value) {
    return allCategories.value;
  }
  
  // Get all descendant IDs of the category being edited
  const getDescendantIds = (categoryId) => {
    const descendants = [];
    const children = allCategories.value.filter(cat => cat.parentId === categoryId);
    
    children.forEach(child => {
      descendants.push(child.id);
      descendants.push(...getDescendantIds(child.id));
    });
    
    return descendants;
  };
  
  const excludeIds = [editingCategory.value.id, ...getDescendantIds(editingCategory.value.id)];
  
  return allCategories.value.filter(cat => !excludeIds.includes(cat.id));
});

// Calculate build counts per category
const buildCounts = computed(() => {
  const counts = {};
  const builds = hunterStore.getBuildsForHunter(props.hunterId) || [];
  
  allCategories.value.forEach(category => {
    const categoryBuilds = hunterStore.getBuildsByCategory(
      props.hunterId, 
      category.id, 
      true // include sub-categories
    );
    counts[category.id] = categoryBuilds.length;
  });
  
  return counts;
});

// Get indented name for select dropdown
function getIndentedName(category) {
  const getLevel = (cat) => {
    if (!cat.parentId) return 0;
    const parent = allCategories.value.find(c => c.id === cat.parentId);
    return parent ? 1 + getLevel(parent) : 0;
  };
  
  const level = getLevel(category);
  const indent = '  '.repeat(level);
  return `${indent}${category.name}`;
}

// Create new category
function createCategory() {
  if (!newCategoryName.value.trim()) {
    showToastMessage('Please enter a category name', 'error');
    return;
  }
  
  try {
    hunterStore.createCategory(props.hunterId, {
      name: newCategoryName.value.trim(),
      color: newCategoryColor.value,
      parentId: newCategoryParentId.value
    });
    
    showToastMessage('Category created successfully', 'success');
    resetForm();
    emit('category-updated');
  } catch (error) {
    console.error('Failed to create category:', error);
    showToastMessage('Failed to create category', 'error');
  }
}

// Start editing a category
function startEdit(category) {
  editingCategory.value = category;
  newCategoryName.value = category.name;
  newCategoryColor.value = category.color;
  newCategoryParentId.value = category.parentId || null;
}

// Save category edits
function saveEdit() {
  if (!editingCategory.value) return;
  
  if (!newCategoryName.value.trim()) {
    showToastMessage('Please enter a category name', 'error');
    return;
  }
  
  try {
    hunterStore.updateCategory(props.hunterId, editingCategory.value.id, {
      name: newCategoryName.value.trim(),
      color: newCategoryColor.value,
      parentId: newCategoryParentId.value
    });
    
    showToastMessage('Category updated successfully', 'success');
    resetForm();
    emit('category-updated');
  } catch (error) {
    console.error('Failed to update category:', error);
    showToastMessage(error.message || 'Failed to update category', 'error');
  }
}

// Cancel editing
function cancelEdit() {
  resetForm();
}

// Delete category
function deleteCategory(categoryId) {
  const category = allCategories.value.find(cat => cat.id === categoryId);
  if (!category) return;
  
  const buildCount = buildCounts.value[categoryId] || 0;
  const subCategories = hunterStore.getSubCategories(props.hunterId, categoryId);
  
  let confirmMessage = `Delete category "${category.name}"?`;
  
  if (buildCount > 0) {
    confirmMessage += `\n\nThis category contains ${buildCount} build(s). They will be moved to the "active" category.`;
  }
  
  if (subCategories.length > 0) {
    confirmMessage += `\n\nThis category has ${subCategories.length} sub-category(ies) that will also be deleted.`;
  }
  
  if (confirm(confirmMessage)) {
    try {
      hunterStore.deleteCategory(props.hunterId, categoryId);
      showToastMessage('Category deleted successfully', 'success');
      
      // Cancel edit if we're editing the deleted category
      if (editingCategory.value && editingCategory.value.id === categoryId) {
        resetForm();
      }
      
      emit('category-updated');
    } catch (error) {
      console.error('Failed to delete category:', error);
      showToastMessage(error.message || 'Failed to delete category', 'error');
    }
  }
}

// Reset form
function resetForm() {
  newCategoryName.value = '';
  newCategoryColor.value = 'blue';
  newCategoryParentId.value = null;
  editingCategory.value = null;
}

// Toast notification
function showToastMessage(message, type = 'info', duration = 3000) {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// Close modal
function closeModal() {
  resetForm();
  emit('close');
}

// Reset form when modal closes
watch(() => props.isVisible, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});
</script>

<style scoped>
.mobile-modal-container {
  padding-bottom: 1rem;
}

@media (max-width: 768px) {
  .mobile-modal-container {
    padding-bottom: var(--mobile-safe-bottom, 70px);
    padding-top: 60px;
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
