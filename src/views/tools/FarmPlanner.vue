<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Farm Planner</h1>
    
    <div class="bg-gray-850 rounded-lg p-6 shadow-lg border border-gray-700">
      <div class="bg-blue-900/30 p-4 rounded-lg mb-6 border border-blue-700">
        <h3 class="font-semibold text-blue-400 mb-1">How to use</h3>
        <ol class="text-sm text-gray-300 list-decimal pl-5 space-y-1">
          <li>Fill in your stats in the fields below</li>
          <li>Click "Open with your Stats" to create a copy of the farming calculator</li>
          <li>A new window will open with the Google Sheet</li>
          <li>Copy the values from the popup and paste them into the appropriate cells</li>
          <li>Click "Save Stats" to save your settings for future use</li>
        </ol>
      </div>
      
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-4">Your Farm Stats</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Core Stats -->
          <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 class="font-medium mb-3 text-blue-400">Core Stats</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium mb-1">Current Fragments</label>
                <input 
                  v-model="stats.fragments" 
                  type="text" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="1.23e5"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Fragment Goal</label>
                <input 
                  v-model="stats.fragmentGoal" 
                  type="text" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="1.00e6"
                />
              </div>
            </div>
          </div>
          
          <!-- Personnel Units -->
          <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 class="font-medium mb-3 text-green-400">Personnel Units</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium mb-1">Mining Pod (T1)</label>
                <input 
                  v-model="stats.miningPod" 
                  type="text" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="1.00e1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Fireteam Carrier (T2)</label>
                <input 
                  v-model="stats.fireteamCarrier" 
                  type="text" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="1.00e1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Titan Hauler (T3)</label>
                <input 
                  v-model="stats.titanHauler" 
                  type="text" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="1.00e1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Combat Corvette (T4)</label>
                <input 
                  v-model="stats.combatCorvette" 
                  type="text" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="1.00e1"
                />
              </div>
            </div>
          </div>
          
          <!-- Mission Speed Modifiers -->
          <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 class="font-medium mb-3 text-yellow-400">Mission Speed</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium mb-1">Relic 3 Level</label>
                <input 
                  v-model="stats.r3Level" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              
              <!-- Checkboxes for mission speed boosts -->
              <div class="flex items-center">
                <input 
                  v-model="stats.engineeringBadge" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Engineering Badge</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="stats.research58lvl1" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Research 58 lvl 1</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="stats.research58lvl3" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Research 58 lvl 3</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="stats.research58lvl5" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Research 58 lvl 5</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="stats.research70lvl5" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Research 70 lvl 5</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="stats.research80lvl5" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Research 80 lvl 5</label>
              </div>
            </div>
          </div>
          
          <!-- Farm Modifiers -->
          <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 class="font-medium mb-3 text-pink-400">Farm Modifiers</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium mb-1">Relic 5 Level</label>
                <input 
                  v-model="stats.r5Level" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Inscryption #102</label>
                <input 
                  v-model="stats.inscryption102" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="stats.powerGemNode3" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Power Gem Node #3</label>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Local Fragment Magnet (lvl)</label>
                <input 
                  v-model="stats.localFragmentMagnet" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Research 82 Level</label>
                <input 
                  v-model="stats.research82Level" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="stats.traitSphere07" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Trait Sphere #07 (x2 farm missions)</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="stats.fragmentationBadge" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Fragmentation Badge</label>
              </div>
            </div>
          </div>
          
          <!-- Campaign Modifiers -->
          <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 class="font-medium mb-3 text-purple-400">Campaign Modifiers</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium mb-1">Relic 11 Level</label>
                <input 
                  v-model="stats.r11Level" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Relic 6 Level</label>
                <input 
                  v-model="stats.r6Level" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Milestone 0 Level</label>
                <input 
                  v-model="stats.milestone0Level" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Boon: Eternity (Campaigns)</label>
                <input 
                  v-model="stats.boonEternity" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="stats.attractionGemNode1" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Attraction Gem Node #1</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="stats.powerGemNode2" 
                  type="checkbox" 
                  class="mr-2"
                />
                <label class="text-sm">Power Gem Node #2</label>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Galactic Frag. Magnet (lvl)</label>
                <input 
                  v-model="stats.galacticFragMagnet" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Research 89 Level</label>
                <input 
                  v-model="stats.research89Level" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Boon of Hegemony (Installs)</label>
                <input 
                  v-model="stats.boonHegemony" 
                  type="number" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          
          <!-- URL Input -->
          <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 class="font-medium mb-3 text-orange-400">Sheet Settings</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium mb-1">Farm Calculator URL</label>
                <input 
                  v-model="customSheetUrl" 
                  type="text" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                />
                <p class="text-xs text-gray-400 mt-1">
                  Leave empty to use the default farm calculator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Save/Load Stats Section -->
      <div class="mt-8 flex flex-wrap gap-3 justify-between">
        <div>
          <button 
            @click="openSheet"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center gap-2 transition-colors"
          >
            <IconExternalLink size="16" />
            <span>Open with your Stats</span>
          </button>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button 
            @click="saveStats"
            class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md flex items-center gap-2 transition-colors"
          >
            <IconDeviceFloppy size="16" />
            <span>Save Stats</span>
          </button>
          
          <button 
            @click="loadStats"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center gap-2 transition-colors"
          >
            <IconDownload size="16" />
            <span>Load Saved Stats</span>
          </button>
          
          <button 
            @click="clearStats"
            class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md flex items-center gap-2 transition-colors"
          >
            <IconTrash size="16" />
            <span>Clear Stats</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  IconFileSpreadsheet, 
  IconPlus, 
  IconExternalLink, 
  IconCopy,
  IconDeviceFloppy,
  IconDownload,
  IconTrash
} from '@tabler/icons-vue';

// User Stats - alle Variablen für das Farm Sheet
const stats = ref({
  // Core Stats
  fragments: '',
  fragmentGoal: '',
  
  // Personnel Units
  miningPod: '',
  fireteamCarrier: '',
  titanHauler: '',
  combatCorvette: '',
  
  // Mission Speed
  r3Level: '',
  engineeringBadge: false,
  research58lvl1: false,
  research58lvl3: false,
  research58lvl5: false,
  research70lvl5: false,
  research80lvl5: false,
  
  // Farm Modifiers
  r5Level: '',
  inscryption102: '',
  powerGemNode3: false,
  localFragmentMagnet: '',
  research82Level: '',
  traitSphere07: false,
  fragmentationBadge: false,
  
  // Campaign Modifiers
  r11Level: '',
  r6Level: '',
  milestone0Level: '',
  boonEternity: '',
  attractionGemNode1: false,
  powerGemNode2: false,
  galacticFragMagnet: '',
  research89Level: '',
  boonHegemony: '',
});

// Standard Farm Sheet URL
const defaultSheetUrl = 'https://docs.google.com/spreadsheets/d/1zAB4tLlJBvmB3LElLTJsjWZdYaPzURAt6bD7TmVFFW0/copy';
const customSheetUrl = ref('');

// Mapping der Zellen im Farm Sheet
const cellMappings = {
  // Core Stats
  'fragments': { cell: 'B1', desc: 'Current Fragments' },
  'fragmentGoal': { cell: 'B2', desc: 'Fragment Goal' },
  
  // Personnel Units
  'miningPod': { cell: 'C6', desc: 'Mining Pod (T1)' },
  'fireteamCarrier': { cell: 'C7', desc: 'Fireteam Carrier (T2)' },
  'titanHauler': { cell: 'C8', desc: 'Titan Hauler (T3)' },
  'combatCorvette': { cell: 'C9', desc: 'Combat Corvette (T4)' },
  
  // Mission Speed
  'r3Level': { cell: 'D18', desc: 'Relic 3 Level' },
  'engineeringBadge': { cell: 'C15', desc: 'Engineering Badge' },
  'research58lvl1': { cell: 'C16', desc: 'Research 58 lvl 1' },
  'research58lvl3': { cell: 'C17', desc: 'Research 58 lvl 3' },
  'research58lvl5': { cell: 'C18', desc: 'Research 58 lvl 5' },
  'research70lvl5': { cell: 'C19', desc: 'Research 70 lvl 5' },
  'research80lvl5': { cell: 'C20', desc: 'Research 80 lvl 5' },
  
  // Farm Modifiers
  'r5Level': { cell: 'B23', desc: 'Relic 5 Level' },
  'inscryption102': { cell: 'B24', desc: 'Inscryption #102' },
  'powerGemNode3': { cell: 'C25', desc: 'Power Gem Node #3' },
  'localFragmentMagnet': { cell: 'B26', desc: 'Local Fragment Magnet' },
  'research82Level': { cell: 'B27', desc: 'Research 82 Level' },
  'traitSphere07': { cell: 'C28', desc: 'Trait Sphere #07' },
  'fragmentationBadge': { cell: 'C29', desc: 'Fragmentation Badge' },
  
  // Campaign Modifiers
  'r11Level': { cell: 'B33', desc: 'Relic 11 Level' },
  'r6Level': { cell: 'B34', desc: 'Relic 6 Level' },
  'milestone0Level': { cell: 'B36', desc: 'Milestone 0 Level' },
  'boonEternity': { cell: 'B37', desc: 'Boon: Eternity' },
  'attractionGemNode1': { cell: 'C38', desc: 'Attraction Gem Node #1' },
  'powerGemNode2': { cell: 'C39', desc: 'Power Gem Node #2' },
  'galacticFragMagnet': { cell: 'B40', desc: 'Galactic Frag. Magnet' },
  'research89Level': { cell: 'B41', desc: 'Research 89 Level' },
  'boonHegemony': { cell: 'B42', desc: 'Boon of Hegemony' }
};

// Öffne das Sheet mit den eingegebenen Stats
function openSheet() {
  // Bestimme die zu verwendende Sheet-URL
  const sheetUrl = customSheetUrl.value || defaultSheetUrl;
  
  // Wenn es keine URL ist, zeige einen Fehler an
  if (!sheetUrl.startsWith('http')) {
    alert('Please enter a valid Google Sheet URL');
    return;
  }
  
  // URL für Google Sheet-Kopie erstellen
  let finalUrl;
  if (sheetUrl.includes('/copy')) {
    finalUrl = sheetUrl;
  } else {
    // Extrahiere die Sheet-ID aus der URL
    const matches = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (matches && matches[1]) {
      finalUrl = `https://docs.google.com/spreadsheets/d/${matches[1]}/copy`;
    } else {
      finalUrl = sheetUrl;
    }
  }
  
  // Öffne das Sheet in einem neuen Tab
  window.open(finalUrl, '_blank');
  
  // Erstelle eine Tabelle mit den Werten zum Kopieren
  let copyTable = "Farm Planner Stats:\n\n";
  copyTable += "Cell\t| Description\t| Value\n";
  copyTable += "------------------------------------\n";
  
  // Füge alle relevanten Stats hinzu
  Object.entries(cellMappings).forEach(([key, info]) => {
    const value = stats.value[key];
    
    // Spezielle Formatierung für Bool-Werte
    let displayValue;
    if (typeof value === 'boolean') {
      displayValue = value ? 'TRUE' : 'FALSE';
    } else {
      displayValue = value || '0'; // Standardwert ist "0", wenn leer
    }
    
    copyTable += `${info.cell}\t| ${info.desc}\t| ${displayValue}\n`;
  });
  
  // Zeige dem Benutzer die zu kopierenden Daten an
  alert(`The farm calculator will open in a new tab. Here are your stats to copy into the corresponding cells:
    
${copyTable}

You can copy this text and refer to it while filling out the spreadsheet.`);
}

// Stats im localStorage speichern
function saveStats() {
  localStorage.setItem('huntersim_farm_stats', JSON.stringify(stats.value));
  localStorage.setItem('huntersim_farm_custom_url', customSheetUrl.value);
  alert('Your farm stats have been saved!');
}

// Stats aus dem localStorage laden
function loadStats() {
  const savedStats = localStorage.getItem('huntersim_farm_stats');
  const savedUrl = localStorage.getItem('huntersim_farm_custom_url');
  
  if (savedStats) {
    stats.value = JSON.parse(savedStats);
    
    if (savedUrl) {
      customSheetUrl.value = savedUrl;
    }
    
    alert('Your saved farm stats have been loaded!');
  } else {
    alert('No saved farm stats found.');
  }
}

// Stats zurücksetzen
function clearStats() {
  // Zurücksetzen aller Werte
  Object.keys(stats.value).forEach(key => {
    if (typeof stats.value[key] === 'boolean') {
      stats.value[key] = false;
    } else {
      stats.value[key] = '';
    }
  });
  
  customSheetUrl.value = '';
  alert('All farm stats have been cleared.');
}
</script>