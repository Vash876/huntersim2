<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 pb-[70px] pt-[530px] sm:py-0"
    @click.self="close"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header mit Schließen-Button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h3 class="text-xl font-bold text-white flex items-center">
          <IconShare size="20" class="mr-2 text-blue-400" />
          Gadget Upgrade Summary
        </h3>
        <button 
          @click="close"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
        >
          <IconX size="18" />
        </button>
      </div>
      
      <!-- Body -->
      <div class="p-5 space-y-4">        
        <!-- Summary Header -->
        <div class="bg-gray-700/50 rounded-md p-3 border border-gray-600/50">
          <div class="grid grid-cols-3 gap-3">
            <div>
              <div class="text-xs text-gray-400 mb-1">REFERENCE BUILD</div>
              <div class="text-sm text-white">{{ buildName || 'None selected' }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-400 mb-1">TOTAL COST</div>
              <div class="text-sm text-amber-400 font-bold">
                {{ formatGadgetCost(totalCost) }}
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-400 mb-1">TIME TO SAVE</div>
              <div 
                class="text-sm font-bold"
                :class="{
                  'text-white': daysToSave < 30, 
                  'text-yellow-400': daysToSave >= 30 && daysToSave < 60, 
                  'text-red-400': daysToSave >= 60 || daysToSave === Infinity
                }" 
              >
                {{ formatTime }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Gadget Table -->
        <div class="bg-gray-700/50 rounded-md border border-gray-600/50 overflow-hidden">
          <!-- Table Header -->
          <div class="grid grid-cols-12 p-2 bg-gray-600/70 text-xs font-medium text-gray-300 border-b border-gray-600">
            <div class="col-span-6 px-2">GADGET</div>
            <div class="col-span-2 px-2 text-center">CURRENT</div>
            <div class="col-span-2 px-2 text-center">TARGET</div>
            <div class="col-span-2 px-2 text-right">COST</div>
          </div>
          
          <!-- Table Body -->
          <div class="text-sm">
            <div 
              v-for="gadget in sortedGadgetData" 
              :key="gadget.id"
              class="grid grid-cols-12 p-2 border-b border-gray-600/30 hover:bg-gray-600/20"
              :class="{'bg-gray-600/10': gadget.hasChanges}"
            >
              <div 
                class="col-span-6 px-2 text-white font-medium"
                :title="gadget.label"  
              >
                {{ gadget.truncatedLabel }}  
              </div>
              <div class="col-span-2 px-2 text-center text-gray-300">{{ gadget.current }}</div>
              <div class="col-span-2 px-2 text-center" 
                :class="gadget.hasChanges ? 'text-green-400 font-medium' : 'text-gray-300'"
              >
                {{ gadget.target }}
              </div>
              <div class="col-span-2 px-2 text-right">
                <span v-if="gadget.hasChanges" class="text-amber-400">
                  {{ formatGadgetCost(gadget.cost) }}
                </span>
                <span v-else class="text-gray-500">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  IconX, 
  IconShare, 
  IconInfoCircle, 
  IconCopy, 
  IconBrandDiscord, 
  IconCheck, 
  IconAlertCircle 
} from '@tabler/icons-vue';
import { GADGETS } from '@/constants/gadgets.js';
import { 
  getGadgetCost, 
  calcGadgetCostDifference, 
  formatGadgetCost 
} from '@/utils/gadgetCostUtils';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  currentLevels: {
    type: Object,
    default: () => ({})
  },
  targetLevels: {
    type: Object,
    default: () => ({})
  },
  totalCost: {
    type: Number,
    default: 0
  },
  daysToSave: {
    type: Number,
    default: 0
  },
  buildName: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);
const copySuccess = ref('');
const copyFail = ref('');

// Funktion zum Kürzen der Gadget-Namen
function truncateGadgetName(name, maxLength) {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
}

// Computed für responsive max length
const maxNameLength = computed(() => {
  // Einfache Bildschirmbreiten-Erkennung
  if (typeof window !== 'undefined') {
    return window.innerWidth < 640 ? 30 : 45; // sm breakpoint = 640px
  }
  return 30; // Fallback für SSR
});

// Sortiert und transformiert die Gadget-Daten für die Anzeige
const sortedGadgetData = computed(() => {
  return GADGETS.map(gadget => {
    const current = props.currentLevels[gadget.id] || 0;
    const target = props.targetLevels[gadget.id] || 0;
    const hasChanges = target > current;
    const cost = hasChanges ? calcGadgetCostDifference(gadget.id, current, target) : 0;
    
    return {
      id: gadget.id,
      label: gadget.label,
      truncatedLabel: truncateGadgetName(gadget.label, maxNameLength.value), // NEU!
      current,
      target,
      hasChanges,
      cost
    };
  });
});

// Formatiere den Zeitwert benutzerfreundlich
const formatTime = computed(() => {
  const days = props.daysToSave;
  
  if (days === Infinity || isNaN(days)) return 'N/A';
  if (days > 36500) return '☠️';
  
  if (days > 365) {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    
    if (months === 0) {
      return `${years}y`;
    } else {
      return `${years}y ${months}m`;
    }
  }
  
  if (days > 60) {
    return `${Math.floor(days)}d`;
  }
  
  const fullDays = Math.floor(days);
  const hours = Math.round((days - fullDays) * 24);
  
  if (fullDays === 0) {
    return `${hours}h`;
  } else if (hours === 0) {
    return `${fullDays}d`;
  } else {
    return `${fullDays}d ${hours}h`;
  }
});

// Schließen des Modals
function close() {
  emit('close');
}

// Sicheres Kopieren für Browser ohne Clipboard API
function safeCopy(text, successMessage) {
  // Prüfe, ob navigator.clipboard existiert
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        copySuccess.value = successMessage;
        copyFail.value = '';
        setTimeout(() => copySuccess.value = '', 2000);
      })
      .catch(err => {
        console.error('Failed to copy with navigator.clipboard:', err);
        fallbackCopy(text, successMessage);
      });
  } else {
    fallbackCopy(text, successMessage);
  }
}

// Fallback-Copy-Methode für Browser ohne Clipboard-API
function fallbackCopy(text, successMessage) {
  try {
    // Erstelle ein temporäres Textfeld
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Verhindere Scrollen
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        copySuccess.value = successMessage;
        copyFail.value = '';
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      copyFail.value = 'Could not copy text. Please copy manually.';
      copySuccess.value = '';
    }
    
    document.body.removeChild(textArea);
    setTimeout(() => {
      copySuccess.value = '';
      copyFail.value = '';
    }, 3000);
  } catch (err) {
    copyFail.value = 'Could not copy text. Please copy manually.';
    copySuccess.value = '';
    setTimeout(() => copyFail.value = '', 3000);
  }
}

// Animation für die Einblendung beim Öffnen des Modals
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    // Bei Öffnen des Modals Fehlermeldungen zurücksetzen
    copySuccess.value = '';
    copyFail.value = '';
  }
});
</script>

<style scoped>
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
</style>