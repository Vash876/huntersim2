<!-- filepath: c:\Users\igorn\projects\huntersim2\src\components\common\ControlButton.vue -->
<template>
  <button
    class="flex justify-center items-center bg-gray-800 hover:bg-gray-700 rounded transition-colors"
    :class="{
      'ml-1': direction === 'left' && !isFast,
      'mr-1': direction === 'right' && !isFast,
      'opacity-20 cursor-not-allowed hover:bg-gray-900': isDisabled,
      'p-2': size !== 'small',
      'p-1.5': size === 'small'
    }"
    :style="{
      minWidth: size === 'small' ? '2rem' : '2.5rem'
    }"
    @mousedown="onMouseDown"
    @dragstart.prevent
    @touchstart.prevent="onTouchStart"
    @touchmove="onTouchMove"
    @touchend.prevent="onTouchEnd"
    @touchcancel.prevent="onTouchCancel"
    :disabled="isDisabled"
  >
    <!-- Wenn isFast true → Doppel-Icon (z.B. doppelte Pfeile) -->
    <div v-if="isFast" class="flex">
      <component :is="icon" :size="size === 'small' ? 16 : 18" />
      <component :is="icon" :size="size === 'small' ? 16 : 18" class="-ml-2" />
    </div>
    <!-- Sonst nur ein Pfeil -->
    <component v-else :is="icon" :size="size === 'small' ? 16 : 18" />
  </button>
</template>

<script setup>
import { computed, onBeforeUnmount } from 'vue'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

// Props
const props = defineProps({
  direction: {
    type: String,
    required: true,
    validator: (val) => ['left','right'].includes(val)
  },
  isFast: Boolean,
  item: {
    type: Object,
    required: true
  },
  // Eine Funktion, um den aktuellen Level aus dem Store / Daten zu holen
  getLevel: { type: Function, required: true },
  
  // Die Haupthandler aus useButtonControls
  handleStart: { type: Function, required: true },
  handleEnd: { type: Function, required: true },
  handleTouchMove: { type: Function, required: true },

  // Aktionen: increment/decrement (+fast)
  increment: { type: Function, required: true },
  decrement: { type: Function, required: true },
  incrementFast: { type: Function, required: true },
  decrementFast: { type: Function, required: true },
  
  // Hinzufügen der size-Prop
  size: { type: String, default: 'normal' }
})

// Icon abhängig von direction
const icon = computed(() => {
  return props.direction === 'left' ? IconChevronLeft : IconChevronRight
})

// Welche Aktion soll ausgeführt werden: normal/schnell (+/-)?
const actionFn = computed(() => {
  if (props.direction === 'left') {
    return props.isFast ? props.decrementFast : props.decrement
  } else {
    return props.isFast ? props.incrementFast : props.increment
  }
})

// Ist der Button deaktiviert?
const isDisabled = computed(() => {
  try {
    if (typeof props.getLevel !== 'function') return true
    if (!props.item) return true
    
    const level = props.getLevel(props.item)
    const maxLevel = props.item.maxLevel ?? Infinity

    // Links = runterzählen => disabled wenn level<=0
    // Rechts = hochzählen => disabled wenn level>=maxLevel
    return props.direction === 'left'
      ? level <= 0
      : level >= maxLevel

  } catch (e) {
    return true
  }
})

// ----------- Maus Events -----------
function onMouseDown(e) {
  // Falls disabled, nichts tun
  if (!isDisabled.value) {
    // Start der Aktion
    props.handleStart(e, actionFn.value, props.item)
    // Falls man außerhalb loslässt, globalen Listener:
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('blur', onWindowBlur)
  }
}

function onMouseUp(e) {
  props.handleEnd(e, props.item)
  removeListeners()
}

function onMouseLeave(e) {
  props.handleEnd(e, props.item)
  removeListeners()
}

function onWindowBlur(e) {
  props.handleEnd(e, props.item)
  removeListeners()
}

function removeListeners() {
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('mouseleave', onMouseLeave)
  window.removeEventListener('blur', onWindowBlur)
}

// ----------- Touch Events -----------
function onTouchStart(e) {
  if (!isDisabled.value) {
    props.handleStart(e, actionFn.value, props.item)
  }
}
function onTouchMove(e) {
  props.handleTouchMove(e, props.item)
}
function onTouchEnd(e) {
  props.handleEnd(e, props.item)
}
function onTouchCancel(e) {
  props.handleEnd(e, props.item)
}

// Clean-up
onBeforeUnmount(() => {
  removeListeners()
})
</script>