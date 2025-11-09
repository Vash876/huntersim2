<template>
  <div class="category-tree-item-draggable">
    <!-- Main Category Item -->
    <div 
      class="p-2 rounded-lg border transition-all"
      :class="[
        isSystem ? 'border-blue-500/30 bg-blue-900/10' : 'border-purple-500/30 bg-purple-900/10',
        isEditing ? 'ring-2 ring-purple-500' : 'hover:border-gray-500'
      ]"
      :style="{ marginLeft: `${depth * 16}px` }"
    >
      <div class="flex items-center justify-between gap-2">
        <!-- Color & Name -->
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <!-- Expand/Collapse Button -->
          <button
            v-if="hasSubCategories && !isEditing"
            @click="toggleExpanded"
            class="p-0.5 rounded hover:bg-gray-700 transition-colors flex-shrink-0"
            :title="isExpanded ? 'Collapse' : 'Expand'"
          >
            <IconChevronDown 
              size="14" 
              class="transition-transform"
              :class="{ 'rotate-[-90deg]': !isExpanded }"
            />
          </button>
          <div v-else-if="!isEditing" class="w-[22px]"></div>
          
          <!-- Color Indicator / Picker -->
          <div v-if="!isEditing" class="flex-shrink-0">
            <div 
              class="w-4 h-4 rounded"
              :class="`bg-${category.color}-500`"
            ></div>
          </div>
          <TailwindColorPicker
            v-else
            :modelValue="editColor"
            @update:modelValue="editColor = $event"
            class="flex-shrink-0"
          />
          
          <!-- Name Display / Edit -->
          <div v-if="!isEditing" class="flex-1 min-w-0">
            <div class="text-sm font-medium text-white truncate">{{ category.name }}</div>
            <div class="text-xs text-gray-400">{{ buildCount }} builds</div>
          </div>
          <div v-else class="flex-1 flex flex-col gap-1.5">
            <!-- Parent Category Dropdown -->
            <select
              v-model="editParentId"
              class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:border-purple-500 focus:outline-none"
            >
              <option :value="null">Top Level (no parent)</option>
              <optgroup label="System Categories">
                <option 
                  v-for="cat in availableParentCategories.system" 
                  :key="cat.id" 
                  :value="cat.id"
                >
                  {{ cat.name }}
                </option>
              </optgroup>
              <optgroup label="Custom Categories" v-if="availableParentCategories.custom.length > 0">
                <option 
                  v-for="cat in availableParentCategories.custom" 
                  :key="cat.id" 
                  :value="cat.id"
                >
                  {{ cat.name }}
                </option>
              </optgroup>
            </select>
            
            <!-- Category Name Input -->
            <input
              v-model="editName"
              type="text"
              placeholder="Category name"
              class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-purple-500 focus:outline-none"
              @keyup.enter="saveChanges"
              @keyup.escape="cancelEdit"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <template v-if="isEditing">
            <button
              @click="saveChanges"
              class="p-1 rounded hover:bg-green-600/20 text-green-400 transition-colors"
              title="Save"
            >
              <IconCheck size="14" />
            </button>
            <button
              @click="cancelEdit"
              class="p-1 rounded hover:bg-red-600/20 text-red-400 transition-colors"
              title="Cancel"
            >
              <IconX size="14" />
            </button>
          </template>
          <template v-else>
            <!-- Add Sub-Category Button -->
            <button
              v-if="!isSystem"
              @click="emit('add-sub', category.id)"
              class="p-1 rounded hover:bg-purple-600/20 text-purple-400 transition-colors"
              title="Add sub-category"
            >
              <IconFolderPlus size="14" />
            </button>
            <!-- Edit Button -->
            <button
              v-if="!isSystem"
              @click="startEdit"
              class="p-1 rounded hover:bg-blue-600/20 text-blue-400 transition-colors"
              title="Edit"
            >
              <IconEdit size="14" />
            </button>
            <!-- Delete Button -->
            <button
              v-if="!isSystem"
              @click="emit('delete', category.id)"
              class="p-1 rounded hover:bg-red-600/20 text-red-400 transition-colors"
              title="Delete"
            >
              <IconTrash size="14" />
            </button>
            <!-- System Label -->
            <div
              v-if="isSystem"
              class="text-xs text-gray-500 px-2"
              title="System category cannot be modified"
            >
              System
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Sub-Categories (Simple List) -->
    <div v-if="hasSubCategories && isExpanded" class="mt-1 space-y-1">
      <CategoryTreeItemDraggable
        v-for="subCategory in subCategories"
        :key="subCategory.id"
        :category="subCategory"
        :hunterId="hunterId"
        :allCategories="allCategories"
        :isSystem="subCategory.isSystem"
        :depth="depth + 1"
        @update="emit('update', $event)"
        @delete="emit('delete', $event)"
        @add-sub="emit('add-sub', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { IconEdit, IconTrash, IconCheck, IconX, IconChevronDown, IconFolderPlus } from '@tabler/icons-vue';
import TailwindColorPicker from '@/components/common/TailwindColorPicker.vue';

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  hunterId: {
    type: String,
    required: true
  },
  allCategories: {
    type: Array,
    required: true
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  depth: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update', 'delete', 'add-sub']);

const hunterStore = useHunterStore();

// Edit state
const isEditing = ref(false);
const editName = ref('');
const editColor = ref('');
const editParentId = ref(null);

// Expand/collapse state
const isExpanded = ref(true);

// Computed
const subCategories = computed(() => {
  return props.allCategories.filter(c => c.parentId === props.category.id);
});

const hasSubCategories = computed(() => {
  return subCategories.value.length > 0;
});

const buildCount = computed(() => {
  const categoryBuilds = hunterStore.getBuildsByCategory(props.hunterId, props.category.id, false);
  return categoryBuilds.length;
});

// Available parent categories (exclude self and own descendants)
const availableParentCategories = computed(() => {
  const isDescendantOf = (categoryId, potentialAncestorId) => {
    let current = props.allCategories.find(c => c.id === categoryId);
    while (current && current.parentId) {
      if (current.parentId === potentialAncestorId) return true;
      current = props.allCategories.find(c => c.id === current.parentId);
    }
    return false;
  };
  
  const available = props.allCategories.filter(c => {
    // Exclude self
    if (c.id === props.category.id) return false;
    // Exclude own descendants (prevent circular nesting)
    if (isDescendantOf(c.id, props.category.id)) return false;
    return true;
  });
  
  return {
    system: available.filter(c => c.isSystem),
    custom: available.filter(c => !c.isSystem)
  };
});

// Methods
function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}

function startEdit() {
  if (props.isSystem) return;
  
  isEditing.value = true;
  editName.value = props.category.name;
  editColor.value = props.category.color;
  editParentId.value = props.category.parentId || null;
}

function saveChanges() {
  if (!editName.value.trim()) return;
  
  emit('update', {
    id: props.category.id,
    name: editName.value.trim(),
    color: editColor.value,
    parentId: editParentId.value
  });
  
  isEditing.value = false;
}

function cancelEdit() {
  isEditing.value = false;
  editName.value = '';
  editColor.value = '';
  editParentId.value = null;
}
</script>

<style scoped>
.category-tree-item-draggable {
  transition: all 0.2s ease;
}

.rotate-\[-90deg\] {
  transform: rotate(-90deg);
}
</style>
