<!-- InfoTooltip.vue -->
<template>
  <span ref="tooltipRef" class="cursor-help text-blue-400 hover:text-blue-300">
    <IconInfoCircle size="14" />
  </span>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { IconInfoCircle } from '@tabler/icons-vue';
import tippy from 'tippy.js';

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  placement: {
    type: String,
    default: 'top'
  }
});

const tooltipRef = ref(null);
let tippyInstance = null;

// Tooltip erstellen und aktualisieren
const createTooltip = () => {
  if (tooltipRef.value) {
    tippyInstance = tippy(tooltipRef.value, {
      content: props.content,
      allowHTML: true,
      theme: 'huntersim',
      placement: props.placement,
      arrow: false,
      animation: 'fade',
      maxWidth: 250,            // Für mobile Geräte besser 250px statt 300px
      
      // Touch-Konfiguration
      trigger: 'mouseenter click',
      touch: true,     // Korrigierte Touch-Konfiguration
      
      // Positionierungsoptionen
      interactive: true,
      interactiveBorder: 10,
      zIndex: 9999,    // Sicherstellen, dass der Tooltip über anderen Elementen liegt
      
      // WICHTIG: Hiermit wird der Tooltip ans Ende des body-Elements angehängt
      // statt als Kind des auslösenden Elements oder dessen Container
      appendTo: document.body,
      
      popperOptions: {
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
              padding: 8           // Abstand zum Bildschirmrand
            }
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom', 'right', 'left', 'top'], // Priorität der Ausweichpositionen
              padding: 5           // Padding für Flip-Detection
            }
          }
        ]
      },
      
      // Animation und Verzögerung
      delay: [100, 0],
      duration: [200, 0]
    });
  }
};

// Tooltip-Inhalt aktualisieren, wenn er sich ändert
watch(() => props.content, (newContent) => {
  if (tippyInstance) {
    tippyInstance.setContent(newContent);
  }
});

onMounted(() => {
  createTooltip();
});

onBeforeUnmount(() => {
  if (tippyInstance) {
    tippyInstance.destroy();
  }
});
</script>