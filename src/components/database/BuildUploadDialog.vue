<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-auto bg-gray-900/80 flex items-center justify-center p-4">
      <div class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-700">
        <!-- Header -->
        <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white flex items-center">
            <IconCloudUpload size="20" class="mr-2" :class="`text-${hunterColor}-400`" />
            Upload Build to Database
          </h3>
          <button 
            @click="$emit('close')"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX size="18" class="text-white" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-5">
          <form @submit.prevent="uploadBuild" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Build Name</label>
              <div class="text-gray-200 bg-gray-700/50 p-2 rounded border border-gray-600">
                {{ buildData.name }}
              </div>
            </div>

            <div>
              <label for="uploaderName" class="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
              <input 
                id="uploaderName"
                v-model="uploaderName"
                type="text"
                class="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="How do you want to be called?"
                required
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-300 mb-1">Description (optional)</label>
              <textarea
                id="description"
                v-model="description"
                class="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Tell something about your build..."
                rows="3"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Tags</label>
              <div class="flex flex-wrap gap-2 pt-1">
                <div 
                  v-for="tag in availableTags" 
                  :key="tag"
                  @click="toggleTag(tag)"
                  class="px-2 py-1 rounded-full text-sm cursor-pointer transition-colors"
                  :class="selectedTags.includes(tag) 
                    ? `bg-${hunterColor}-600 text-white` 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                >
                  {{ tag }}
                </div>
              </div>
            </div>

            <div class="pt-2 border-t border-gray-700 flex justify-end space-x-3">
              <button 
                type="button" 
                @click="$emit('close')" 
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 rounded text-white flex items-center"
                :class="`bg-${hunterColor}-600 hover:bg-${hunterColor}-500`"
                :disabled="isUploading"
              >
                <IconCloudUpload v-if="!isUploading" size="16" class="mr-2" />
                <IconLoader v-else size="16" class="mr-2 animate-spin" />
                {{ isUploading ? 'Uploading...' : 'Upload Build' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { IconCloudUpload, IconX, IconLoader } from '@tabler/icons-vue';
import { uploadBuild as uploadBuildToDatabase } from '@/services/databaseService';

const props = defineProps({
  show: Boolean,
  buildData: Object,
  hunterColor: { type: String, default: 'blue' }
});

const emit = defineEmits(['close', 'uploaded']);

const uploaderName = ref(localStorage.getItem('uploaderName') || '');
const description = ref('');
const selectedTags = ref([]);
const isUploading = ref(false);

const availableTags = [
  'Farming', 'Boss', 'PvE', 'Early Game', 'Mid Game', 'Late Game', 'Experimental'
];

function toggleTag(tag) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
}

async function uploadBuild() {
  if (!uploaderName.value.trim()) {
    if (window.toast) window.toast.error('Please enter your name');
    return;
  }
  
  try {
    isUploading.value = true;
    
    // Save name for future uploads
    localStorage.setItem('uploaderName', uploaderName.value);
    
    // Upload build
    await uploadBuildToDatabase(
      props.buildData, 
      uploaderName.value, 
      description.value, 
      selectedTags.value
    );
    
    emit('uploaded');
    emit('close');
    
  } catch (error) {
    console.error('Error uploading build:', error);
    if (window.toast) window.toast.error('Error uploading build');
  } finally {
    isUploading.value = false;
  }
}
</script>