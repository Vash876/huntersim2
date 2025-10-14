<template>
  <div 
    class="border border-gray-700 rounded-md p-2 hover:border-gray-600 transition-all duration-200"
    :class="{
      'bg-gray-700/50 border-gray-600': isSelected,
      'bg-gray-700/30': !isSelected
    }"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 flex-1">
        <!-- Color Picker -->
        <ColorPicker 
          :modelValue="localResource.color"
          @update:modelValue="updateColor"
        />
        
        <!-- Resource Name (Editable for custom resources) -->
        <div class="flex-1">
          <input
            v-if="isEditing && resource.category === 'custom'"
            v-model="editName"
            @blur="saveName"
            @keyup.enter="saveName"
            @keyup.escape="cancelEdit"
            ref="nameInput"
            class="bg-transparent border-b border-blue-500 text-xs font-medium text-white focus:outline-none w-full"
            placeholder="Resource name"
          />
          <div
            v-else
            @click="startEdit"
            class="text-xs font-medium text-white"
            :class="{ 'cursor-pointer hover:text-blue-300': resource.category === 'custom' }"
            :title="resource.category === 'custom' ? 'Click to edit name' : ''"
          >
            {{ localResource.name }}
          </div>
        </div>
      </div>
      
      <div class="flex flex-col items-end gap-1">
        <!-- Track Toggle and Label -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400">Track</span>
          <div
            @click="$emit('toggle')"
            class="relative cursor-pointer"
          >
            <div
              class="w-8 h-4 rounded-full transition-colors duration-200 ease-in-out"
              :class="{
                'bg-green-500': isSelected,
                'bg-gray-600': !isSelected
              }"
            >
              <div
                class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ease-in-out"
                :class="{
                  'transform translate-x-4': isSelected
                }"
              ></div>
            </div>
          </div>
        </div>
        
        <!-- Show in Table Toggle and Label -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400">Table</span>
          <div
            @click="$emit('toggleTable')"
            class="relative cursor-pointer"
            :class="{ 'opacity-50 cursor-not-allowed': !isSelected }"
            :title="!isSelected ? 'Resource must be tracked to show in table' : 'Show highest value in main table'"
          >
            <div
              class="w-8 h-4 rounded-full transition-colors duration-200 ease-in-out"
              :class="{
                'bg-blue-500': showInTable && isSelected,
                'bg-gray-600': !showInTable || !isSelected
              }"
            >
              <div
                class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ease-in-out"
                :class="{
                  'transform translate-x-4': showInTable && isSelected
                }"
              ></div>
            </div>
          </div>
        </div>
        
        <!-- Remove Button (for custom resources) -->
        <div class="flex items-center">
          <button
            v-if="resource.category === 'custom'"
            @click="$emit('remove', resource.id)"
            class="text-gray-400 hover:text-red-400 transition-colors opacity-70 hover:opacity-100"
            title="Remove custom resource"
          >
            <IconX size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import { IconX } from '@tabler/icons-vue';
import ColorPicker from '@/components/common/ColorPicker.vue';

const props = defineProps({
  resource: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  showInTable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle', 'toggleTable', 'remove', 'update']);

const localResource = ref({ ...props.resource });
const isEditing = ref(false);
const editName = ref('');
const nameInput = ref(null);

// Watch for prop changes
watch(() => props.resource, (newVal) => {
  localResource.value = { ...newVal };
}, { deep: true });

// Methods
function updateColor(newColor) {
  localResource.value.color = newColor;
  emit('update', localResource.value);
}

function startEdit() {
  if (props.resource.category !== 'custom') return;
  
  isEditing.value = true;
  editName.value = localResource.value.name;
  
  nextTick(() => {
    if (nameInput.value) {
      nameInput.value.focus();
      nameInput.value.select();
    }
  });
}

function saveName() {
  if (!editName.value.trim()) {
    cancelEdit();
    return;
  }
  
  localResource.value.name = editName.value.trim();
  isEditing.value = false;
  emit('update', localResource.value);
}

function cancelEdit() {
  isEditing.value = false;
  editName.value = '';
}
</script>
