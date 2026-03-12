<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl border border-gray-800 p-4 sm:p-8">
      <!-- Heading (mobile only) -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white md:hidden">
        Miscellaneous
      </h2>

      <!-- Info Banner + Settings Toggle -->
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-blue-900/30 border border-blue-800 rounded-lg p-3 text-center flex-1">
          <p class="text-blue-200 text-sm">
            Quick reference tables and handy tools for commonly needed game values.
          </p>
        </div>
        <button
          @click="showSettings = !showSettings"
          class="p-2 rounded-lg border transition-colors"
          :class="showSettings
            ? 'bg-blue-900/40 border-blue-600 text-blue-300'
            : 'bg-gray-800/50 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'"
          title="Toggle widget visibility"
        >
          <IconSettings :size="18" />
        </button>
      </div>

      <!-- Widget Visibility Toggles -->
      <div v-if="showSettings" class="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mb-4 animate-fade-in">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Visible Widgets</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="widget in allWidgets"
            :key="widget.id"
            @click="miscStore.toggleVisibility(widget.id)"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border"
            :class="miscStore.isVisible(widget.id)
              ? 'bg-blue-900/40 border-blue-700 text-blue-300'
              : 'bg-gray-900/40 border-gray-700 text-gray-500 line-through'"
          >
            {{ widget.label }}
          </button>
        </div>
      </div>

      <!-- Draggable Widgets Grid -->
      <Draggable
        v-model="orderedVisibleWidgets"
        handle=".grip-handle"
        :animation="200"
        item-key="id"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
        ghost-class="drag-ghost"
        @end="onDragEnd"
      >
        <template #item="{ element: widget }">
          <div
            class="relative flex flex-col rounded-xl overflow-hidden border backdrop-blur-sm transition-[shadow,border-color] duration-300 hover:shadow-md hover:border-white/[0.08]"
            :class="[widget.border, widget.bg, widget.hoverShadow, widget.colSpan || '']"
          >
            <!-- Top Accent Bar -->
            <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r" :class="widget.accent"></div>
            <div class="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-br from-white via-transparent to-transparent"></div>

            <!-- Drag Handle -->
            <div class="grip-handle absolute top-1.5 right-1.5 cursor-grab active:cursor-grabbing p-1 rounded text-gray-600 hover:text-gray-400 transition-colors z-10">
              <IconGripVertical :size="14" />
            </div>

            <!-- Widget Component -->
            <component :is="widget.component" />
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { IconSettings, IconGripVertical } from '@tabler/icons-vue';
import Draggable from 'vuedraggable';
import { WIDGETS, WIDGET_MAP } from './widgetRegistry.js';
import { useMiscStore } from './store.js';
import { useContentAccess } from './useContentAccess.js';

const miscStore = useMiscStore();
const access = useContentAccess();
const showSettings = ref(false);

// All widgets that pass their requires check (for settings panel)
const allWidgets = computed(() =>
  WIDGETS.filter(w => !w.requires || w.requires(access))
);

onMounted(() => {
  miscStore.initWidgets(WIDGETS.map(w => w.id));
});

// Ordered + visible widgets for the draggable grid
const orderedVisibleWidgets = computed({
  get() {
    return miscStore.widgetOrder
      .filter(id => miscStore.isVisible(id) && WIDGET_MAP[id])
      .filter(id => {
        const w = WIDGET_MAP[id];
        return !w.requires || w.requires(access);
      })
      .map(id => WIDGET_MAP[id]);
  },
  set(newList) {
    // Rebuild full order: visible items in new order + hidden items appended
    const newVisibleIds = newList.map(w => w.id);
    const hiddenIds = miscStore.widgetOrder.filter(
      id => !miscStore.isVisible(id)
    );
    miscStore.setOrder([...newVisibleIds, ...hiddenIds]);
  },
});

function onDragEnd() {
  // Order is already persisted via the computed setter
}
</script>

<style scoped>
.drag-ghost {
  opacity: 0.4;
  border: 2px dashed rgba(147, 130, 220, 0.5) !important;
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
