<!-- filepath: c:\Users\igorn\projects\huntersim2\src\components\common\BuildModal.vue -->
<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="confirmClose"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fade-in"
      @click.stop
    >
      <!-- Header mit Schließen-Button -->
      <div :class="`bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center sticky top-0 z-10`">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconPlus size="20" :class="`mr-2 text-${hunterColor}-400`" />
          <span :class="`text-${hunterColor}-500`">{{ hunterName }}</span><span class="ml-1">Build Creator</span> 
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
        <!-- Fehlermeldung für ungültigen Build -->
        <div 
          v-if="showSaveError" 
          class="mb-5 bg-red-900/30 border border-red-500 p-3 rounded-lg text-red-300 flex items-start"
        >
          <div class="mr-3 pt-0.5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <p class="font-medium">{{ saveError }}</p>
            <p class="mt-1 text-sm opacity-80">Please check the highlighted attributes and ensure that you have adequately distributed points in the base attributes.</p>
          </div>
        </div>
        <!-- Build Name Input für Mobile -->
        <div class="mb-5 bg-gray-700 rounded-lg p-4 border border-gray-600">
          <label for="buildName" class="block text-xs font-medium text-gray-300 mb-2">Build Name</label>
          
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
          
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-3">
            <div 
              v-for="talent in talents" 
              :key="talent.key" 
              class="bg-gray-700 rounded-lg p-2 border border-gray-600 hover:border-gray-500 transition-colors"
            >
              <!-- Desktop Layout -->
              <div class="hidden md:block">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs sm:text-sm font-medium text-white">{{ talent.label }}</span>
                  <div class="flex items-center">
                    <span :class="`text-base font-bold text-${hunterColor}-400`">
                      {{ buildData.talents[talent.key] || 0 }}
                    </span>
                    <span class="text-xs text-gray-500 ml-1">
                      /{{ talent.max }}
                    </span>
                  </div>
                </div>

                <!-- Desktop Controls -->
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
              
              <!-- Mobile Layout -->
              <div class="md:hidden">
                <span class="text-xs font-medium text-white block mb-1">{{ talent.label }}</span>
                
                <!-- Mobile Controls -->
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
                    size="small"
                  />

                  <div class="flex items-center justify-center">
                    <span :class="`text-base font-bold text-${hunterColor}-400 pr-1`">
                      {{ buildData.talents[talent.key] || 0 }}
                    </span>
                    <span class="text-xs text-gray-500">
                      /{{ talent.max }}
                    </span>
                  </div>

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
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Attributes Section -->
        <div class="mb-6">
          <h3 class="text-white font-medium py-2 border-b border-gray-600">Attributes</h3>
          
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-3">
            <div 
              v-for="attribute in attributes" 
              :key="attribute.key" 
              :class="[
                'bg-gray-700 rounded-lg p-2 border transition-colors',
                invalidAttributes.includes(attribute.key) 
                  ? 'border-red-500 bg-red-900/10' 
                  : 'border-gray-600 hover:border-gray-500',
                {'bg-gray-700/20 border-gray-700/50': !canIncreaseAttribute(attribute)}
              ]"
            >
              <!-- Desktop Layout -->
              <div class="hidden md:block">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex flex-col">
                    <span class="text-xs sm:text-sm font-medium text-white">{{ attribute.label }}</span>
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

                <!-- Desktop Controls -->
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
              
              <!-- Mobile Layout -->
              <div class="md:hidden">
                <div class="flex flex-col mb-1">
                  <span class="text-xs font-medium text-white">{{ attribute.label }}</span>
                </div>
                
                <!-- Mobile Controls -->
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
                    size="small"
                  />

                  <div class="flex items-center justify-center">
                    <span :class="`text-base font-bold text-${hunterColor}-400 pr-1`">
                      {{ buildData.attributes[attribute.key] || 0 }}
                    </span>
                    <span v-if="attribute.max !== Infinity" class="text-xs text-gray-500">
                      /{{ attribute.max }}
                    </span>
                  </div>

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
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobil: Buttons am unteren Rand -->
        <div class="md:hidden bottom-0 bg-gray-800 p-4 border-t border-gray-600 mt-8">
          <div class="flex gap-2">
            <button 
              @click="openOverrideModal"
              class="flex-1 px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md flex items-center justify-center"
            >
              Overrides
            </button>
            <button 
              @click="saveBuild"
              class="flex-1 px-3 py-2 bg-blue-600 hover:bg-purple-600 text-white rounded-md flex items-center justify-center"
            >
              {{ isEditMode ? 'Update Build' : 'Create Build' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Confirmation Dialog -->
  <div 
    v-if="showCloseConfirmation" 
    class="fixed inset-0 z-[60] overflow-y-auto bg-black/70 flex items-center justify-center p-4"
    @click.self="cancelClose"
  >
    <div class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md animate-fade-in p-5 border border-gray-600">
      <h3 class="text-lg font-medium text-white mb-3">Discard changes?</h3>
      <p class="text-gray-300 mb-5">You have unsaved changes in this build. Are you sure you want to discard them?</p>
      
      <div class="flex justify-end gap-3">
        <button 
          @click="cancelClose"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
        >
          Cancel
        </button>
        <button 
          @click="confirmAndClose"
          class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md"
        >
          Discard
        </button>
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
import { IconX, IconPlus } from '@tabler/icons-vue';
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
  isNew: true,
  hunter: props.hunterType,
  level: 1,
  talents: {},
  attributes: {},
  timestamp: Date.now()
});

// Neue Funktionen zum Validieren von Attributen basierend auf min-values
const showSaveError = ref(false);
const saveError = ref('');
const invalidAttributes = ref([]);

// Prüft, ob ein einzelnes Attribut gültig ist (Voraussetzungen erfüllt)
function isAttributeValid(attributeKey) {
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

// Überprüft alle Attribute und aktualisiert die invalidAttributes Liste
function validateAllAttributes() {
  const invalid = [];
  
  // Prüfe jedes Attribut, ob seine Mindestanforderungen erfüllt sind
  for (const attribute of attributes.value) {
    const attrKey = attribute.key;
    // Nur Attribute mit Punkten müssen validiert werden
    if ((buildData.value.attributes[attrKey] || 0) > 0 && !isAttributeValid(attrKey)) {
      invalid.push(attrKey);
    }
  }
  
  invalidAttributes.value = invalid;
  return invalid.length === 0; // true wenn alle Attribute gültig sind
}

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
  // Erst alle Attribute validieren
  const isValid = validateAllAttributes();
  
  if (!isValid) {
    saveError.value = "This Build is invalid. Please check the attributes.";
    showSaveError.value = true;
    return;
  }
  
  // Wenn alles gültig ist, normal fortfahren
  saveError.value = '';
  showSaveError.value = false;

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

// Füge einen ref für die Schließbestätigung hinzu
const showCloseConfirmation = ref(false);

// Prüfe, ob Änderungen vorhanden sind
const hasChanges = computed(() => {
  // Für einen komplett neuen Build
  if (!props.buildToEdit) {
    // Prüfen, ob irgendwelche Talent- oder Attributpunkte verteilt wurden
    const hasTalentPoints = Object.values(buildData.value.talents).some(val => val > 0);
    const hasAttributePoints = Object.values(buildData.value.attributes).some(val => val > 0);
    const hasName = buildData.value.name.trim().length > 0;
    const hasOverrides = Object.keys(buildData.value.overrides || {}).length > 0;
    
    return hasTalentPoints || hasAttributePoints || hasName || hasOverrides;
  } 
  // Für einen editierten Build - Vergleich mit dem Original
  else {
    const original = props.buildToEdit;
    
    // Name hat sich geändert
    if (buildData.value.name !== original.name) return true;
    
    // Overrides haben sich geändert
    const originalOverrides = original.overrides || {};
    const newOverrides = buildData.value.overrides || {};
    
    if (Object.keys(originalOverrides).length !== Object.keys(newOverrides).length) return true;
    
    for (const key in newOverrides) {
      if (newOverrides[key] !== originalOverrides[key]) return true;
    }
    
    // Talente haben sich geändert
    for (const key in buildData.value.talents) {
      const newValue = buildData.value.talents[key] || 0;
      const oldValue = original.talents?.[key] || 0;
      if (newValue !== oldValue) return true;
    }
    
    // Attribute haben sich geändert
    for (const key in buildData.value.attributes) {
      const newValue = buildData.value.attributes[key] || 0;
      const oldValue = original.attributes?.[key] || 0;
      if (newValue !== oldValue) return true;
    }
    
    // Keine Änderungen gefunden
    return false;
  }
});

// confirmClose-Funktion:
function confirmClose() {
  // Nur den Dialog anzeigen, wenn tatsächlich Änderungen vorliegen
  if (hasChanges.value) {
    showCloseConfirmation.value = true;
  } else {
    // Keine Änderungen? Direkt schließen
    handleClose();
  }
}

// Schließen abbrechen
function cancelClose() {
  showCloseConfirmation.value = false;
}

// Schließen bestätigen
function confirmAndClose() {
  showCloseConfirmation.value = false;
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

// Watcher für Attributänderungen
watch(() => buildData.value.attributes, () => {
  validateAllAttributes();
}, { deep: true });

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

/* Scrollbar-Stile */
@media (min-width: 768px) {
  ::-webkit-scrollbar {
    width: 14px; /* Erhöhe diese Zahl für eine breitere Scrollbar */
  }

  ::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5); /* Dunklerer Hintergrund für die Spur */
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(75, 85, 99, 0.8); /* Farbe des Scrollbar-Daumens */
    border-radius: 8px;
    border: 2px solid rgba(31, 41, 55, 0.5); /* Abstand zwischen Daumen und Rand */
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.9); /* Hellere Farbe beim Hover */
  }
}
</style>