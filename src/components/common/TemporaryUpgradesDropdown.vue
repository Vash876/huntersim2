<template>
  <div ref="buttonRef" class="relative">
    <button 
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors"
      :class="{ 'bg-gray-700': isOpen }"
    >
      <IconClock size="16" />
      <span class="text-sm font-medium">Temporary Upgrades</span>
      <IconChevronDown 
        size="16" 
        class="transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu - Portal to body -->
    <Teleport to="body">
      <Transition name="dropdown">
        <div 
          v-if="isOpen"
          ref="dropdownRef"
          class="fixed w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-[9999] max-h-140 overflow-y-auto"
          :style="dropdownStyle"
        >
        <div class="p-2 border-b border-gray-600">
          <h3 class="text-sm font-semibold text-white">Temporary Upgrades</h3>
          <p class="text-xs text-gray-400 mt-0.5">for quick adjustments after TR</p>
        </div>

        <div v-if="Object.keys(upgradesByCategory).length === 0" class="p-3 text-center text-gray-400 text-xs">
          No temporary upgrades available
        </div>

        <div v-else class="py-1">
          <div 
            v-for="(categoryGroup, categoryKey) in upgradesByCategory" 
            :key="categoryKey"
            class="mb-2 last:mb-0"
          >
            <!-- Category Header -->
            <div class="px-3 py-2 bg-gray-700/50 border-b border-gray-600/30 flex items-center">
              <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
              <h4 class="text-xs font-semibold text-gray-200 uppercase tracking-wide">
                {{ categoryGroup.name }}
              </h4>
            </div>
            
            <!-- Category Upgrades -->
            <div class="p-1 space-y-1">
              <div 
                v-for="upgrade in categoryGroup.upgrades" 
                :key="upgrade.key"
                class="flex items-center justify-between px-2 py-1.5 hover:bg-gray-700/30 rounded transition-colors"
              >
                <!-- Upgrade Name -->
                <span class="text-xs text-white flex-1 mr-2 leading-relaxed">{{ upgrade.name }}</span>
                
                <!-- Controls -->
                <div class="flex-shrink-0">
                  <!-- Boolean Toggle -->
                  <button
                    v-if="upgrade.isBoolean"
                    @click="toggleBoolean(upgrade.key)"
                    class="w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    :class="getHunterToggleColor(upgrade.currentValue)"
                  >
                    <div 
                      class="w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200"
                      :class="upgrade.currentValue ? 'translate-x-5' : 'translate-x-0'"
                    ></div>
                  </button>
                  
                  <!-- Value Controls -->
                  <ValueControls
                    v-else
                    :value="upgrade.currentValue"
                    :minValue="0"
                    :maxValue="upgrade.maxLevel || 999"
                    :showFastControls="false"
                    :step="1"
                    :valueClass="getValueColorClass(upgrade.key, upgrade.currentValue)"
                    @update:value="(newVal) => updateUpgradeValue(upgrade.key, newVal)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>

    <!-- Backdrop -->
    <div 
      v-if="isOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-[9998]"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { IconClock, IconChevronDown } from '@tabler/icons-vue';
import { useHunterStore } from '../../store/hunterStore';
import { useGemPlannerStore } from '../../store/gemPlannerStore';
import { UPGRADES } from '../../constants/upgrades';
import { HUNTERS } from '../../constants/hunters';
import ValueControls from './ValueControls.vue';

const props = defineProps({
  hunterId: { type: String, required: true }
});

const emit = defineEmits(['upgradeChanged']);

const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();
const isOpen = ref(false);
const buttonRef = ref(null);
const dropdownRef = ref(null);
const dropdownStyle = ref({});

// Change tracking
const hasChanges = ref(false);
const initialValues = ref({});
const pendingChanges = ref({}); // Speichere Änderungen bis zum Schließen

// Berechne die temporären Upgrades für den aktuellen Hunter
const temporaryUpgrades = computed(() => {
  const upgrades = [];

  // Durchlaufe alle Upgrade-Kategorien
  Object.entries(UPGRADES).forEach(([categoryKey, categoryUpgrades]) => {
    if (!Array.isArray(categoryUpgrades)) return;
    
    categoryUpgrades.forEach(upgrade => {
      // Prüfe ob das Upgrade temporär ist
      if (!upgrade.temporary) return;
      
      // Prüfe ob das Upgrade für diesen Hunter relevant ist
      const isRelevant = isUpgradeRelevantForHunter(upgrade, {}, categoryKey);
      if (!isRelevant) return;

      // Hole den aktuellen Wert aus dem Store
      const currentValue = getCurrentUpgradeValue(categoryKey, upgrade.id);
      
      // Bestimme ob es ein Boolean-Upgrade ist
      const isBoolean = upgrade.maxLevel === 1 || upgrade.type === 'boolean';
      
      upgrades.push({
        key: `upgrades.${categoryKey}.${upgrade.id}`,
        name: upgrade.name,
        maxLevel: upgrade.maxLevel,
        currentValue: currentValue,
        categoryKey: categoryKey,
        categoryName: formatCategoryName(categoryKey),
        upgradeId: upgrade.id,
        isBoolean: isBoolean
      });
    });
  });

  return upgrades.sort((a, b) => a.name.localeCompare(b.name));
});

// Gruppiere Upgrades nach Kategorien
const upgradesByCategory = computed(() => {
  const groups = {};
  
  temporaryUpgrades.value.forEach(upgrade => {
    if (!groups[upgrade.categoryKey]) {
      groups[upgrade.categoryKey] = {
        name: upgrade.categoryName,
        upgrades: []
      };
    }
    groups[upgrade.categoryKey].upgrades.push(upgrade);
  });
  
  // Definiere gewünschte Reihenfolge der Kategorien
  const categoryOrder = ['researches', 'cms', 'loopmods', 'shardmilestones'];
  
  // Sortiere Kategorien nach der definierten Reihenfolge
  const sortedGroups = {};
  categoryOrder.forEach(categoryKey => {
    if (groups[categoryKey]) {
      sortedGroups[categoryKey] = groups[categoryKey];
    }
  });
  
  // Füge alle anderen Kategorien am Ende hinzu (falls es welche gibt)
  Object.entries(groups).forEach(([key, value]) => {
    if (!categoryOrder.includes(key)) {
      sortedGroups[key] = value;
    }
  });
    
  return sortedGroups;
});

// Prüfe ob ein Upgrade für den Hunter relevant ist
function isUpgradeRelevantForHunter(upgrade, hunterUpgrades, categoryKey) {
  // Prüfe zuerst Gem-Anforderungen (wie in Researches.vue)
  if (upgrade.unlock_gem && upgrade.unlock_lvl) {
    const gemState = gemPlannerStore.getGemState(upgrade.unlock_gem);
    const currentGemLevel = gemState?.level || 0;
    
    // Verstecke das Upgrade wenn das erforderliche Gem-Level nicht erreicht ist
    if (currentGemLevel < upgrade.unlock_lvl) {
      return false;
    }
  }
  
  // Wenn das Upgrade einen hunter-Wert hat, prüfe diesen
  if (upgrade.hunter) {
    if (upgrade.hunter === 'all') return true;
    if (upgrade.hunter === props.hunterId) return true;
    if (Array.isArray(upgrade.hunter) && upgrade.hunter.includes(props.hunterId)) return true;
    return false;
  }

  // Für diese Version zeigen wir alle temporären Upgrades an (die die Gem-Anforderungen erfüllen)
  return true;
}

// Hole den aktuellen Wert eines Upgrades aus dem Store oder pending changes
function getCurrentUpgradeValue(categoryKey, upgradeId) {
  // Prüfe zuerst pending changes
  if (pendingChanges.value[categoryKey] && pendingChanges.value[categoryKey][upgradeId] !== undefined) {
    return pendingChanges.value[categoryKey][upgradeId];
  }
  
  // Ansonsten vom Store
  return hunterStore.getUpgradeValue(categoryKey, upgradeId);
}

// Formatiere Kategorie-Namen für die Anzeige
function formatCategoryName(categoryKey) {
  const categoryNames = {
    researches: 'Research',
    loopmods: 'Loop Mods',
    cms: 'Construction Milestones',
    shardmilestones: 'Shard Milestones',
  };
  
  return categoryNames[categoryKey] || categoryKey;
}

// Bestimme die Textfarbe basierend auf dem Wert
function getValueColorClass(upgradeKey, value) {
  if (value > 0) {
    return 'text-green-400';
  }
  return 'text-gray-500';
}

// Bestimme die Hunter-Farbe für Toggle-Buttons
function getHunterToggleColor(isActive) {
  const hunter = HUNTERS.find(h => h.id === props.hunterId);
  const hunterColor = hunter?.color || 'blue';
  
  if (isActive) {
    switch (hunterColor) {
      case 'red': return 'bg-red-600';
      case 'green': return 'bg-green-600';
      case 'blue': return 'bg-blue-600';
      default: return 'bg-blue-600';
    }
  } else {
    return 'bg-gray-600';
  }
}

// Aktualisiere einen Upgrade-Wert
function updateUpgradeValue(upgradeKey, newValue) {
  const upgrade = temporaryUpgrades.value.find(u => u.key === upgradeKey);
  if (!upgrade) return;

  // Speichere die Änderung nur temporär, nicht im Store
  if (!pendingChanges.value[upgrade.categoryKey]) {
    pendingChanges.value[upgrade.categoryKey] = {};
  }
  pendingChanges.value[upgrade.categoryKey][upgrade.upgradeId] = newValue;
  
  // Markiere als geändert für spätere Neuevaluierung
  hasChanges.value = true;
  
  // Emitte Änderung für Parent-Komponente (aber noch keine Neuevaluierung)
  emit('upgradeChanged', {
    key: upgradeKey,
    category: upgrade.categoryKey,
    upgradeId: upgrade.upgradeId,
    value: newValue,
    triggerReevaluation: false // Neuevaluierung erst beim Schließen
  });
}

// Toggle für Boolean-Upgrades
function toggleBoolean(upgradeKey) {
  const upgrade = temporaryUpgrades.value.find(u => u.key === upgradeKey);
  if (!upgrade) return;

  const newValue = upgrade.currentValue ? 0 : 1;
  updateUpgradeValue(upgradeKey, newValue);
}

// Dropdown-Funktionen
function toggleDropdown() {
  if (isOpen.value) {
    // Dropdown wird geschlossen - prüfe auf Änderungen
    closeDropdown();
  } else {
    // Dropdown wird geöffnet - speichere initiale Werte
    openDropdown();
  }
}

function openDropdown() {
  // Speichere aktuelle Werte als Referenz
  initialValues.value = {};
  temporaryUpgrades.value.forEach(upgrade => {
    initialValues.value[upgrade.key] = upgrade.currentValue;
  });
  
  hasChanges.value = false;
  pendingChanges.value = {}; // Leere pending changes
  isOpen.value = true;
  
  nextTick(() => {
    updateDropdownPosition();
  });
}

function closeDropdown() {
  isOpen.value = false;
  
  // Prüfe ob Änderungen vorgenommen wurden
  if (hasChanges.value) {
    // Jetzt erst die Änderungen in den Store übernehmen
    Object.entries(pendingChanges.value).forEach(([categoryKey, categoryChanges]) => {
      Object.entries(categoryChanges).forEach(([upgradeId, value]) => {
        hunterStore.updateUpgrade(categoryKey, upgradeId, value);
      });
    });
    
    // Emitte Event für Neuevaluierung aller Builds
    emit('upgradeChanged', {
      type: 'dropdownClosed',
      hasChanges: true,
      triggerReevaluation: true
    });
    
    hasChanges.value = false;
  }
  
  // Reset all tracking
  initialValues.value = {};
  pendingChanges.value = {};
}

// Positionierung des Dropdowns
function updateDropdownPosition() {
  if (!buttonRef.value || !isOpen.value) return;
  
  const buttonRect = buttonRef.value.getBoundingClientRect();
  const dropdownWidth = 320; // w-80 = 320px
  const dropdownHeight = 384; // max-h-96 = 384px
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Bestimme horizontale Position
  let left = buttonRect.right - dropdownWidth; // Standardmäßig rechts ausgerichtet
  if (left < 8) { // Mindestabstand zum linken Rand
    left = buttonRect.left; // Links ausrichten wenn nicht genug Platz
  }
  if (left + dropdownWidth > viewportWidth - 8) {
    left = viewportWidth - dropdownWidth - 8; // Am rechten Rand ausrichten
  }
  
  // Bestimme vertikale Position
  let top = buttonRect.bottom + 8; // Standardmäßig unter dem Button
  if (top + dropdownHeight > viewportHeight - 8) {
    // Wenn nicht genug Platz unten, über dem Button anzeigen
    top = buttonRect.top - dropdownHeight - 8;
    if (top < 8) {
      // Wenn auch oben nicht genug Platz, in der Mitte des Viewports
      top = Math.max(8, (viewportHeight - dropdownHeight) / 2);
    }
  }
  
  dropdownStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  };
}

// Event Listener für ESC-Taste
function handleKeydown(event) {
  if (event.key === 'Escape' && isOpen.value) {
    closeDropdown();
  }
}

// Lade Hunter-Upgrades asynchron
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', updateDropdownPosition);
  window.addEventListener('scroll', updateDropdownPosition, true);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', updateDropdownPosition);
  window.removeEventListener('scroll', updateDropdownPosition, true);
});

// Watch für Hunter-Änderungen
watch(() => props.hunterId, () => {
  closeDropdown();
});

// Watch für isOpen um Position zu aktualisieren
watch(isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      updateDropdownPosition();
    });
  }
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}
</style>
