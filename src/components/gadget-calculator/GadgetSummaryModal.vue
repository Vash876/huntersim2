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
      <div class="p-2 space-y-4">        
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
          <div class="grid grid-cols-14 md:grid-cols-20 p-2 md:p-2 py-5 md:py-2 bg-gray-600/70 text-xs font-medium text-gray-300 border-b border-gray-600">
            <div class="col-span-2 md:col-span-1"></div>
            <div class="col-span-10 px-2 hidden md:block">GADGET</div>
            <div class="col-span-3 md:col-span-2 px-2 text-center">CURRENT</div>
            <div class="col-span-3 md:col-span-2 px-2 text-center">TARGET</div>
            <div class="col-span-3 md:col-span-2 px-2 text-center">TIME</div>
            <div class="col-span-3 md:col-span-3 px-2 text-right">COST</div>
          </div>
          
          <!-- Table Body -->
          <div class="text-sm">
            <div 
              v-for="gadget in sortedGadgetData" 
              :key="gadget.id"
              class="grid grid-cols-14 md:grid-cols-20 p-1 md:p-2 md:py-2 border-b border-gray-600/30 hover:bg-gray-600/20"
              :class="{'bg-gray-600/10': gadget.hasChanges}"
            >
              <div class="col-span-2 md:col-span-1 px-1 flex items-center justify-center min-w-0">
                <img 
                  v-if="gadget.imageUrl" 
                  :src="gadget.imageUrl" 
                  :alt="gadget.label"
                  class="w-6 h-6 md:w-6 md:h-6 object-contain flex-shrink-0"
                  style="min-width: 30px; min-height: 30px;"
                />
              </div>
              <div 
                class="col-span-10 px-2 text-white font-medium items-center hidden md:flex"
                :title="gadget.label"  
              >
                {{ gadget.truncatedLabel }}  
              </div>
              <div class="col-span-3 md:col-span-2 px-2 text-center text-gray-300 flex items-center justify-center">{{ gadget.current }}</div>
              <div class="col-span-3 md:col-span-2 px-2 text-center flex items-center justify-center" 
                :class="gadget.hasChanges ? 'text-green-400 font-medium' : 'text-gray-300'"
              >
                {{ gadget.target }}
              </div>
              <div class="col-span-3 md:col-span-2 px-2 text-center text-xs flex items-center justify-center">
                <span v-if="gadget.hasChanges" class="text-blue-400">
                  <span v-if="gadget.id === 'anchor' && evaluatingAnchor" class="animate-spin w-3 h-3 border border-blue-300 border-t-transparent rounded-full mr-1"></span>
                  {{ formatIndividualTime(gadget.id, gadget.cost) }}
                </span>
                <span v-else class="text-gray-500">-</span>
              </div>
              <div class="col-span-3 md:col-span-3 px-2 text-right flex items-center justify-end">
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
  },
  tessarectsPerDay: {
    type: Number,
    default: 0
  },
  gadgetImages: {
    type: Object,
    default: () => ({})
  },
  currentTesseracts: {
    type: Number,
    default: 0
  },
  anchorEvaluationEnabled: {
    type: Boolean,
    default: false
  },
  anchorEvaluations: {
    type: Object,
    default: () => ({})
  },
  evaluatingAnchor: {
    type: Boolean,
    default: false
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
  // Für das Modal verwenden wir eine feste, kompakte Länge
  return 48;
});

// Hilfsfunktion um die Bildnummer zu ermitteln
function getGadgetImageNumber(gadgetId) {
  const gadgetIndex = GADGETS.findIndex(g => g.id === gadgetId);
  return gadgetIndex + 1; // 1-basiert für die Dateinamen
}

// Hilfsfunktion um Gadget Image URL zu bekommen
function getGadgetImageUrl(gadgetId) {
  const imageNumber = getGadgetImageNumber(gadgetId);
  return props.gadgetImages[imageNumber] || null;
}

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
      truncatedLabel: truncateGadgetName(gadget.label, maxNameLength.value),
      imageUrl: getGadgetImageUrl(gadget.id),
      current,
      target,
      hasChanges,
      cost
    };
  });
});

// Formatiere individuelle Zeiten für einzelne Gadgets
function formatIndividualTime(gadgetId, cost) {
  // Spezielle Behandlung für Anchor of Ages
  if (gadgetId === 'anchor') {
    return formatAnchorSaveTime();
  }
  
  // Standard-Behandlung für alle anderen Gadgets
  if (cost <= 0 || props.tessarectsPerDay <= 0) return 'N/A';
  
  // Berücksichtige bereits verfügbare Tesseracts
  const remainingCost = Math.max(0, cost - (props.currentTesseracts || 0));
  if (remainingCost <= 0) return 'Available now';
  
  const days = remainingCost / props.tessarectsPerDay;
  
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
}

// Berechne individuelle Sparzeit für Anchor of Ages mit Level-by-Level Evaluation (aus GadgetCalculator kopiert)
function formatAnchorSaveTime() {
  const currentLevel = props.currentLevels.anchor || 0;
  const targetLevel = props.targetLevels.anchor || 0;
  
  if (targetLevel <= currentLevel) {
    return 'No upgrade planned';
  }
  
  // Prüfe ob wir Evaluationen haben und diese verwendet werden sollen
  const hasEvaluations = Object.keys(props.anchorEvaluations).length > 0;
  const shouldUseEvaluations = hasEvaluations && props.anchorEvaluationEnabled;
  
  if (!shouldUseEvaluations) {
    // Normale Berechnung ohne Evaluation - verwende Standard-Zeitberechnung
    const cost = calcGadgetCostDifference('anchor', currentLevel, targetLevel);
    const remainingCost = Math.max(0, cost - (props.currentTesseracts || 0));
    if (remainingCost <= 0) return 'Available now';
    
    const days = remainingCost / props.tessarectsPerDay;
    return formatTimeValue(days);
  }
  
  // Berechne kumulative Zeit mit steigender Produktion (ähnlich wie im GadgetCalculator)
  let cumulativeDays = 0;
  let availableTesseracts = props.currentTesseracts || 0;
  let currentProduction = props.tessarectsPerDay; // Basis-Produktion
  
  for (let level = currentLevel + 1; level <= targetLevel; level++) {
    // Berechne die Kosten nur für diesen einen Level (nicht kumulativ)
    const singleLevelCost = getGadgetCost('anchor', level);
    const remainingCost = Math.max(0, singleLevelCost - availableTesseracts);
    
    if (remainingCost > 0 && currentProduction > 0) {
      const daysForThisLevel = remainingCost / currentProduction;
      cumulativeDays += daysForThisLevel;
      
      // Nach dem Warten haben wir genug produziert + das was wir schon hatten
      availableTesseracts += daysForThisLevel * currentProduction;
    }
    
    // Nach dem Kauf: Verfügbare Tesseracts um die Kosten dieses Levels reduzieren
    availableTesseracts -= singleLevelCost;
    
    // WICHTIG: Neue Produktion für nächstes Level anwenden
    const evaluation = props.anchorEvaluations[level];
    if (evaluation && evaluation.tesseractsPerDay) {
      const newDailyTesseracts = evaluation.tesseractsPerDay;
      const tolerance = currentProduction * 0.001; // 0.1% Toleranz
      if (newDailyTesseracts > (currentProduction + tolerance)) {
        currentProduction = newDailyTesseracts; // Verwende den genauen Wert
      }
    }
  }
  
  return formatTimeValue(cumulativeDays);
}

// Hilfsfunktion für einheitliche Zeitformatierung
function formatTimeValue(days) {
  if (days === Infinity || isNaN(days)) return 'N/A';
  if (days > 36500) return '☠️';
  if (days <= 0) return 'Available now';
  
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
}

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