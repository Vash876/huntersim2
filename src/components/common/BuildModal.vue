<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/common/BuildModal.vue -->
<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fade-in"
      @click.stop
    >
      <!-- Header mit Schließen-Button -->
      <div :class="`bg-gradient-to-r from-${hunterColor}-900/30 to-gray-700 p-4 border-b border-gray-600 flex justify-between items-center sticky top-0 z-10`">
        <h2 class="text-xl font-bold text-white">
          <span :class="`text-${hunterColor}-500`">{{ hunterName }}</span> Build Creator
        </h2>
        <button 
          @click="handleClose"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Build-Form Inhalt -->
      <div class="p-4">
        <!-- Build Name Input für Mobile -->
        <div class="mb-5 bg-gray-700 rounded-lg p-4 border border-gray-600">
          <label for="buildName" class="block text-sm font-medium text-gray-300 mb-2">Build Name</label>
          
          <!-- Desktop Layout: Input und Buttons nebeneinander -->
          <div class="hidden md:flex gap-2">
            <input 
              type="text" 
              id="buildName" 
              v-model="buildData.name" 
              class="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter build name..."
            />
            <button 
              @click="openOverrideModal"
              class="px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md"
              title="Customize game parameters for simulation"
            >
              <IconAdjustments size="18" class="mr-1" />
              Overrides
            </button>
            <button 
              @click="saveBuild"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md disabled:bg-blue-900 disabled:opacity-50"
            >
              {{ isEditMode ? 'Update Build' : 'Create Build' }}
            </button>
          </div>
          
          <!-- Mobile Layout: Input und Buttons untereinander -->
          <div class="flex flex-col gap-3 md:hidden">
            <input 
              type="text" 
              id="buildNameMobile" 
              v-model="buildData.name" 
              class="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter build name..."
            />
            <div class="flex gap-2">
              <button 
                @click="openOverrideModal"
                class="flex-1 px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md flex items-center justify-center"
                title="Customize game parameters for simulation"
              >
                <IconAdjustments size="18" class="mr-1" />
                Overrides
              </button>
              <button 
                @click="saveBuild"
                class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md disabled:bg-blue-900 disabled:opacity-50"
              >
                {{ isEditMode ? 'Update' : 'Create' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Build Summary Stats - Sticky -->
        <div class="mb-5 bg-gray-700 rounded-lg p-4 border border-gray-600 sticky top-[73px] z-10">
          <div class="grid grid-cols-3 gap-2 text-center">
            <!-- Level -->
            <div>
              <div class="text-sm text-gray-300">Level</div>
              <div class="font-semibold text-white text-base">{{ calculatedLevel }}</div>
            </div>
            
            <!-- Talent Points -->
            <div>
              <div class="text-sm text-gray-300">Talents</div>
              <div class="font-semibold text-base" :class="{'text-red-400': usedTalentPoints > maxTalentPoints, 'text-white': usedTalentPoints <= maxTalentPoints}">
                {{ usedTalentPoints }}/{{ maxTalentPoints }}
              </div>
            </div>
            
            <!-- Attribute Points -->
            <div>
              <div class="text-sm text-gray-300">Attributes</div>
              <div class="font-semibold text-white text-base">
                {{ usedAttributePoints }}/{{ maxAttributePoints }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Talents Section -->
        <div class="mb-6">
          <h3 class="text-white font-medium py-2 border-b border-gray-600">Talents</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            <div 
              v-for="talent in talents" 
              :key="talent.key" 
              class="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-white">{{ talent.label }}</span>
                <div class="flex items-center">
                  <span :class="`text-base font-bold text-${hunterColor}-400`">
                    {{ buildData.talents[talent.key] || 0 }}
                  </span>
                  <span class="text-xs text-gray-500 ml-1">
                    /{{ talent.max }}
                  </span>
                </div>
              </div>

              <!-- Controls -->
              <div class="flex items-center justify-between mt-2">
                <ControlButton 
                  direction="left"
                  :isFast="false"
                  :item="getTalentItem(talent)"
                  :getLevel="getTalentLevel"
                  :handleStart="handleStart"
                  :handleEnd="handleEnd"
                  :handleTouchMove="handleTouchMove"
                  :increment="increment"
                  :decrement="decrement"
                  :incrementFast="incrementFast"
                  :decrementFast="decrementFast"
                />

                <ProgressBar 
                  :value="buildData.talents[talent.key] || 0"
                  :maxValue="talent.max"
                  :color="hunterColor"
                  class="flex-1 mx-1.5 h-5"
                />

                <ControlButton 
                  direction="right"
                  :isFast="false"
                  :item="getTalentItem(talent)"
                  :getLevel="getTalentLevel"
                  :handleStart="handleStart"
                  :handleEnd="handleEnd"
                  :handleTouchMove="handleTouchMove"
                  :increment="increment"
                  :decrement="decrement"
                  :incrementFast="incrementFast"
                  :decrementFast="decrementFast"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Attributes Section -->
        <div class="mb-6">
          <h3 class="text-white font-medium py-2 border-b border-gray-600">Attributes</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            <div 
              v-for="attribute in attributes" 
              :key="attribute.key" 
              :class="[
                'bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors',
                {'bg-gray-700/20 border-gray-700/50': !canIncreaseAttribute(attribute)}
              ]"
            >
              <div class="flex justify-between items-center mb-2">
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-white">{{ attribute.label }}</span>
                  <span class="text-xs text-gray-400">
                    (Cost: {{ attribute.cost }} point<span v-if="attribute.cost > 1">s</span>)
                  </span>
                </div>
                <div class="flex items-center">
                  <span :class="`text-base font-bold text-${hunterColor}-400`">
                    {{ buildData.attributes[attribute.key] || 0 }}
                  </span>
                  <span v-if="attribute.max !== Infinity" class="text-xs text-gray-500 ml-1">
                    /{{ attribute.max }}
                  </span>
                </div>
              </div>

              <!-- Controls -->
              <div class="flex items-center justify-between mt-2">
                <ControlButton 
                  direction="left"
                  :isFast="false"
                  :item="getAttributeItem(attribute)"
                  :getLevel="getAttributeLevel"
                  :handleStart="handleStart"
                  :handleEnd="handleEnd"
                  :handleTouchMove="handleTouchMove"
                  :increment="increment"
                  :decrement="decrement"
                  :incrementFast="incrementFast"
                  :decrementFast="decrementFast"
                  :disabled="!canDecreaseAttribute(attribute)"
                />

                <ProgressBar 
                  :value="buildData.attributes[attribute.key] || 0"
                  :maxValue="attribute.max === Infinity ? 100 : attribute.max"
                  :color="hunterColor"
                  class="flex-1 mx-1.5 h-5"
                />

                <ControlButton 
                  direction="right"
                  :isFast="false"
                  :item="getAttributeItem(attribute)"
                  :getLevel="getAttributeLevel"
                  :handleStart="handleStart"
                  :handleEnd="handleEnd"
                  :handleTouchMove="handleTouchMove"
                  :increment="increment"
                  :decrement="decrement"
                  :incrementFast="incrementFast"
                  :decrementFast="decrementFast"
                  :disabled="!canIncreaseAttribute(attribute)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <OverrideModal
    :isVisible="showOverrideModal"
    :hunterType="props.hunterType"
    :hunterColor="hunterColor"
    :buildName="buildData.name || 'Neuer Build'"
    :buildId="buildData.id"
    :currentOverrides="buildData.overrides || {}"
    @close="showOverrideModal = false"
    @overridesUpdated="updateOverrides"
  />
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import ProgressBar from './ProgressBar.vue';
import ControlButton from './ControlButton.vue';
import { useButtonControls } from '../../utils/useButtonControls';
import { IconX } from '@tabler/icons-vue';
import { getHunterById, HUNTERS } from '../../constants/hunters';
import { useHunterStore } from '../../store/hunterStore';
import OverrideModal from './OverrideModal.vue';

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  hunterType: {
    type: String,
    required: true,
    validator: (value) => HUNTERS.some(hunter => hunter.id === value)
  },
  buildToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'buildCreated', 'buildUpdated']);

// Zentraler Hunter-Store
const hunterStore = useHunterStore();

// Hunter-Information aus zentraler Konfiguration abrufen
const hunterInfo = computed(() => getHunterById(props.hunterType));
const hunterName = computed(() => hunterInfo.value.name);
const hunterColor = computed(() => hunterInfo.value.color);

// Daten für Talente und Attribute
const talents = ref([]);
const attributes = ref([]);
const attributeDependencies = ref({});
const attributeMinValues = ref({});

const showOverrideModal = ref(false);

// Build-Daten
const buildData = ref({
  id: null,
  name: '',
  hunter: props.hunterType,
  level: 1,
  talents: {},
  attributes: {},
  timestamp: Date.now()
});

// Öffnet das Override-Modal
function openOverrideModal() {
  showOverrideModal.value = true;
}

// Aktualisiert die Overrides im Build
function updateOverrides(payload) {
  // Prüfe, ob es das neue Format mit buildId ist
  if (typeof payload === 'object' && 'buildId' in payload) {
    const { buildId, overrides } = payload;
    
    // Für neue Builds oder wenn die IDs übereinstimmen
    if (!buildId || !buildData.value.id || buildId === buildData.value.id) {
      buildData.value.overrides = { ...overrides };
    }
  } else {
    // Direktes Overrides-Objekt (altes Format)
    buildData.value.overrides = { ...payload };
  }
}

const isEditMode = computed(() => {
  // Korrigiert: Prüfe, ob der buildToEdit eine ID hat und es sich nicht um einen geklonten Build handelt
  return !!props.buildToEdit && !!buildData.value.id;
});

// Lädt die Hunter-spezifischen Daten
async function loadHunterData() {
  try {
    if (props.hunterType === 'borge') {
      const borgeModule = await import('@/constants/borge');
      talents.value = borgeModule.TALENTS || [];
      attributes.value = borgeModule.ATTRIBUTES || [];
      attributeDependencies.value = borgeModule.ATTRIBUTE_DEPENDENCIES || {};
      attributeMinValues.value = borgeModule.ATTRIBUTE_MIN_VALUE || {};
    } 
    else if (props.hunterType === 'ozzy') {
      const ozzyModule = await import('@/constants/ozzy');
      talents.value = ozzyModule.TALENTS || [];
      attributes.value = ozzyModule.ATTRIBUTES || [];
      attributeDependencies.value = ozzyModule.ATTRIBUTE_DEPENDENCIES || {};
      attributeMinValues.value = ozzyModule.ATTRIBUTE_MIN_VALUE || {};
    }
    else if (props.hunterType === 'knox') {
      const knoxModule = await import('@/constants/knox');
      talents.value = knoxModule.TALENTS || [];
      attributes.value = knoxModule.ATTRIBUTES || [];
      attributeDependencies.value = knoxModule.ATTRIBUTE_DEPENDENCIES || {};
      attributeMinValues.value = knoxModule.ATTRIBUTE_MIN_VALUE || {};
    }
    
    // Build-Daten initialisieren
    initBuildData();
    
  } catch (error) {
    console.error(`Fehler beim Laden der Daten für ${hunterName.value}:`, error);
  }
}

// Build-Daten initialisieren
function initBuildData() {
  if (props.buildToEdit) {
    // Build zum Bearbeiten oder Klonen kopieren
    buildData.value = JSON.parse(JSON.stringify(props.buildToEdit));

    if (!buildData.value.overrides) {
      buildData.value.overrides = {};
    }
  } else {
    // Neuen Build mit Defaultwerten erstellen
    buildData.value = {
      // Bei einem neuen Build eine temporäre ID erstellen
      // Diese wird später beim Speichern durch eine permanente ersetzt
      id: null,
      name: '',
      hunter: props.hunterType,
      level: 1,
      talents: {},
      attributes: {},
      overrides: {},
      timestamp: Date.now()
    };
    
    // Talente mit 0 initialisieren
    talents.value.forEach(talent => {
      buildData.value.talents[talent.key] = 0;
    });
    
    // Attribute mit 0 initialisieren
    attributes.value.forEach(attr => {
      buildData.value.attributes[attr.key] = 0;
    });
  }
}

// Build-Level und Punkte berechnen
const usedTalentPoints = computed(() => {
  return Object.values(buildData.value.talents).reduce((sum, val) => sum + val, 0);
});

const usedAttributePoints = computed(() => {
  return Object.entries(buildData.value.attributes).reduce((sum, [key, val]) => {
    const attribute = attributes.value.find(a => a.key === key);
    if (!attribute) return sum;
    return sum + (val * (attribute.cost || 1));
  }, 0);
});

const calculatedLevel = computed(() => {
  const talentLevel = usedTalentPoints.value;
  const attributeLevel = Math.ceil(usedAttributePoints.value / 3);
  return Math.max(talentLevel, attributeLevel, 1); // Minimum level is 1
});

const maxTalentPoints = computed(() => calculatedLevel.value);
const maxAttributePoints = computed(() => calculatedLevel.value * 3);

// Item-Objekt für ControlButton mit ID und maxLevel
function getTalentItem(talent) {
  return {
    id: talent.key,
    maxLevel: talent.max || Infinity
  }
}

// Funktion für useButtonControls - holt den aktuellen Talent-Wert
function getTalentLevel(item) {
  return buildData.value.talents[item.id] || 0;
}

// Update-Funktion für Talente
function updateTalentLevel(talentKey, newLevel) {
  const talent = talents.value.find(t => t.key === talentKey);
  if (!talent) return;
  
  const max = talent.max || Infinity;
  buildData.value.talents[talentKey] = Math.min(Math.max(0, newLevel), max);
}

// Item-Objekt für Attribute
function getAttributeItem(attribute) {
  return {
    id: attribute.key,
    maxLevel: attribute.max || Infinity
  }
}

// Funktion für useButtonControls - holt den aktuellen Attribut-Wert
function getAttributeLevel(item) {
  return buildData.value.attributes[item.id] || 0;
}

// Prüft, ob die Mindestpunktzahl für ein Attribut erreicht ist
function hasRequiredAttributePoints(attributeKey) {
  const minValue = attributeMinValues.value[attributeKey] || 0;
  if (minValue <= 0) return true;
  
  // Summe der Attributpunkte von Attributen mit niedrigeren Mindestwert-Anforderungen
  let totalPointsFromLowerAttributes = 0;
  
  // Iteriere durch alle Attribute und prüfe ihre Min-Werte
  for (const attribute of attributes.value) {
    const attrKey = attribute.key;
    const attrMinValue = attributeMinValues.value[attrKey] || 0;
    
    // Attribute mit niedrigeren Mindestanforderungen berücksichtigen
    if (attrMinValue < minValue) {
      // Multipliziere mit den Kosten, falls vorhanden
      const attrCost = attribute.cost || 1;
      totalPointsFromLowerAttributes += (buildData.value.attributes[attrKey] || 0) * attrCost;
    }
  }
  
  return totalPointsFromLowerAttributes >= minValue;
}

// Findet alle Abhängigen Attribute für ein bestimmtes Attribut
function findDependentAttributes(attributeKey) {
  const dependents = [];
  
  Object.entries(attributeDependencies.value).forEach(([key, deps]) => {
    if (deps.includes(attributeKey)) {
      dependents.push(key);
      // Rekursiv weitere Abhängigkeiten finden
      const nestedDependents = findDependentAttributes(key);
      dependents.push(...nestedDependents);
    }
  });
  
  // Entferne Duplikate
  return [...new Set(dependents)];
}

// Prüfen, ob Attribut erhöht werden kann
function canIncreaseAttribute(attribute) {
  if (!attribute?.key) return false;

  // Prüfe auf Max-Level
  const currentLevel = buildData.value.attributes[attribute.key] || 0;
  if (currentLevel >= (attribute.max || Infinity)) return false;
  
  // Prüfe Abhängigkeiten
  const dependencies = attributeDependencies.value[attribute.key];
  if (dependencies && dependencies.length) {
    const hasDepsAllocated = dependencies.every(dep => (buildData.value.attributes[dep] || 0) > 0);
    if (!hasDepsAllocated) return false;
  }

  // Prüfe Min-Wert-Anforderung
  if (!hasRequiredAttributePoints(attribute.key)) {
    return false;
  }

  return true;
}

// Prüfen, ob Attribut verringert werden kann
function canDecreaseAttribute(attribute) {
  if (!attribute?.key) return false;
  
  const currentLevel = buildData.value.attributes[attribute.key] || 0;
  if (currentLevel <= 0) return false;
  
  return true;
}

// Update-Funktion für Attribute
function updateAttributeLevel(attributeKey, newLevel) {
  const attribute = attributes.value.find(a => a.key === attributeKey);
  if (!attribute) return;
  
  const currentLevel = buildData.value.attributes[attributeKey] || 0;
  
  // Erhöhen
  if (newLevel > currentLevel && !canIncreaseAttribute(attribute)) {
    return;
  }
  
  // Verringern
  if (newLevel < currentLevel && !canDecreaseAttribute(attribute)) {
    return;
  }
  
  const max = attribute.max || Infinity;
  const newValue = Math.min(Math.max(0, newLevel), max);
  buildData.value.attributes[attributeKey] = newValue;
  
  // Wenn das Attribut auf 0 gesetzt wird, setze alle abhängigen Attribute auf 0
  if (newValue === 0) {
    const dependentAttrs = findDependentAttributes(attributeKey);
    dependentAttrs.forEach(depKey => {
      buildData.value.attributes[depKey] = 0;
    });
  }
}

// useButtonControls initialisieren
const {
  handleStart,
  handleEnd,
  handleTouchMove,
  increment,
  decrement,
  incrementFast,
  decrementFast
} = useButtonControls({
  getLevel: (item) => {
    // Prüfen, ob es sich um Talent oder Attribut handelt
    const isTalent = talents.value.some(t => t.key === item.id);
    if (isTalent) {
      return getTalentLevel(item);
    } else {
      return getAttributeLevel(item);
    }
  },
  updateLevel: (item, newLevel) => {
    // Prüfen, ob es sich um Talent oder Attribut handelt
    const isTalent = talents.value.some(t => t.key === item.id);
    if (isTalent) {
      updateTalentLevel(item.id, newLevel);
    } else {
      updateAttributeLevel(item.id, newLevel);
    }
  }
});

// Build speichern
function saveBuild() {
  // Level und Zeitstempel aktualisieren
  buildData.value.level = calculatedLevel.value;
  buildData.value.timestamp = Date.now();
  
  // Wenn kein Name eingegeben wurde, "Unnamed" verwenden
  if (!buildData.value.name.trim()) {
    buildData.value.name = "Unnamed";
  }
  
  // Generiere ID wenn keine vorhanden (geklonter Build)
  if (!buildData.value.id) {
    buildData.value.id = Date.now().toString();
  }
  
  // Build im hunterStore speichern
  try {
    const buildCopy = JSON.parse(JSON.stringify(buildData.value)); // Tiefe Kopie erstellen
    
    if (props.buildToEdit && props.buildToEdit.id) {
      // Existierenden Build aktualisieren
      hunterStore.updateBuild(buildCopy); // Eine Parameter-Version
    } else {
      // Neuen Build erstellen
      hunterStore.addBuild(props.hunterType, buildCopy); // Zwei Parameter-Version
    }
    
    emit(props.buildToEdit && props.buildToEdit.id ? 'buildUpdated' : 'buildCreated', buildCopy);
    handleClose();
  } catch (error) {
    console.error('Fehler beim Speichern des Builds:', error);
  }
}

// Modal schließen
function handleClose() {
  emit('close');
}

// Beobachter für Änderungen der Sichtbarkeit und des Hunter-Typs
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    loadHunterData();
  }
});

watch(() => props.hunterType, () => {
  if (props.isVisible) {
    loadHunterData();
  }
});

watch(() => props.buildToEdit, () => {
  if (props.isVisible && props.buildToEdit) {
    initBuildData();
  }
});

onMounted(() => {
  if (props.isVisible) {
    loadHunterData();
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