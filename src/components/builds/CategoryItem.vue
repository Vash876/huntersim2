<template>
  <div 
    class="category-item p-2 rounded-lg border transition-all"
    :class="[
      isSystem ? 'border-blue-500/30 bg-blue-900/10' : 'border-purple-500/30 bg-purple-900/10',
      isEditing ? 'ring-2 ring-purple-500' : 'hover:border-gray-500'
    ]"
  >
    <div class="flex items-center justify-between gap-2">
      <!-- Color & Name -->
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <!-- Color Indicator / Picker -->
        <div v-if="!isEditing" class="flex-shrink-0">
          <div 
            class="w-4 h-4 rounded"
            :class="`bg-${category.color}-500`"
          ></div>
        </div>
        <ColorPicker
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
        <input
          v-else
          v-model="editName"
          type="text"
          class="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-purple-500 focus:outline-none"
          @keyup.enter="saveChanges"
          @keyup.escape="cancelEdit"
        />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <!-- Edit Mode Buttons -->
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

        <!-- Normal Mode Buttons -->
        <template v-else>
          <button
            v-if="!isSystem"
            @click="startEdit"
            class="p-1 rounded hover:bg-blue-600/20 text-blue-400 transition-colors"
            title="Edit"
          >
            <IconEdit size="14" />
          </button>
          <button
            v-if="!isSystem"
            @click="emit('delete', category.id)"
            class="p-1 rounded hover:bg-red-600/20 text-red-400 transition-colors"
            title="Delete"
          >
            <IconTrash size="14" />
          </button>
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
</template>

<script setup>
import { ref, computed } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { IconEdit, IconTrash, IconCheck, IconX } from '@tabler/icons-vue';
import ColorPicker from '@/components/common/ColorPicker.vue';

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  buildCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update', 'delete']);

const hunterStore = useHunterStore();

// Edit state
const isEditing = ref(false);
const editName = ref('');
const editColor = ref('');

// Methods
function startEdit() {
  if (props.isSystem) return;
  
  isEditing.value = true;
  editName.value = props.category.name;
  editColor.value = props.category.color;
}

function saveChanges() {
  if (!editName.value.trim()) return;
  
  emit('update', {
    id: props.category.id,
    name: editName.value.trim(),
    color: editColor.value
  });
  
  isEditing.value = false;
}

function cancelEdit() {
  isEditing.value = false;
  editName.value = '';
  editColor.value = '';
}
</script>

<style scoped>
.category-item {
  transition: all 0.2s ease;
}
</style>
