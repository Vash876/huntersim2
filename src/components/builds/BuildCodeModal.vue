<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header with close button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconShare size="20" class="mr-2 text-blue-400" />
          Share Build
        </h2>
        <button 
          @click="$emit('close')"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Modal content -->
      <div class="p-5">
        <p class="text-sm text-gray-300 mb-4">
          Choose your sharing format:
        </p>
        
        <div class="mb-4">
          <textarea
            ref="codeTextarea"
            :value="currentCode"
            readonly
            class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white text-sm h-40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
            @click="selectCode"
          ></textarea>
        </div>
        
        <!-- Two buttons side by side -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <button 
            @click="copyRawCode" 
            :class="{ 
              'bg-green-600 hover:bg-green-700': rawCopied, 
              'bg-gray-600 hover:bg-gray-700': !rawCopied,
              'ring-2 ring-blue-400': codeFormat === 'raw'
            }"
            class="p-2 rounded-md transition-colors flex flex-col justify-center items-center gap-1"
          >
            <div class="flex items-center gap-1">
              <IconCheck v-if="rawCopied" size="16" />
              <IconCopy v-else size="16" />
              <span class="text-xs font-medium">{{ rawCopied ? 'Copied!' : 'Raw Code' }}</span>
            </div>
            <span class="text-[10px] text-gray-300">Direct import</span>
          </button>
          
          <button 
            @click="copyDiscordCode" 
            :class="{ 
              'bg-green-600 hover:bg-green-700': discordCopied, 
              'bg-blue-600 hover:bg-blue-700': !discordCopied,
              'ring-2 ring-blue-400': codeFormat === 'discord'
            }"
            class="p-2 rounded-md transition-colors flex flex-col justify-center items-center gap-1"
          >
            <div class="flex items-center gap-1">
              <IconCheck v-if="discordCopied" size="16" />
              <IconBrandDiscord v-else size="16" />
              <span class="text-xs font-medium">{{ discordCopied ? 'Copied!' : 'Discord' }}</span>
            </div>
            <span class="text-[10px] text-gray-300">Share formatted</span>
          </button>
        </div>
        
        <div class="p-3 bg-blue-900/20 border border-blue-500/30 rounded-md mb-4">
          <p class="text-xs text-blue-300 mb-1">
            <strong>{{ codeFormat === 'discord' ? 'Discord Format:' : 'Raw Format:' }}</strong>
          </p>
          <p class="text-xs text-gray-400">
            {{ codeFormat === 'discord' 
                ? 'Includes build info and Discord code block formatting for easy sharing.' 
                : 'Pure build code for direct import into the application.' 
            }}
          </p>
        </div>
        
        <div class="border-t border-gray-600 pt-4">
          <p class="text-sm text-gray-300 mb-3">
            Or share this link:
          </p>
          
          <div class="flex">
            <input
              ref="linkInput"
              :value="shareLink"
              readonly
              class="flex-grow bg-gray-700 border border-gray-600 rounded-l-md p-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              @click="selectLink"
            />
            <button 
              @click="copyLinkToClipboard"
              :class="{ 'bg-green-600 hover:bg-green-700': linkCopied, 'bg-blue-600 hover:bg-blue-700': !linkCopied }"
              class="px-3 rounded-r-md transition-colors"
            >
              <IconCheck v-if="linkCopied" size="18" />
              <IconCopy v-else size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconShare, IconX, IconCopy, IconCheck, IconBrandDiscord } from '@tabler/icons-vue';
import { BuildCodeHandler } from '../../utils/BuildCodeHandler';
import { useHunterStore } from '../../store/hunterStore';
import { useGemPlannerStore } from '../../store/gemPlannerStore';
import { formatNumber } from '@/composables/format';
import { getHunterById } from '@/constants/hunters';

// Props
const props = defineProps({
  show: Boolean,
  build: Object,
  results: Object  // Add results prop
});

// Emits
const emit = defineEmits(['close']);

// Store
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// Refs
const codeTextarea = ref(null);
const linkInput = ref(null);
const rawCopied = ref(false);
const discordCopied = ref(false);
const linkCopied = ref(false);
const codeFormat = ref('raw'); // 'raw' or 'discord'

// Helper function to convert gem states to upgrades format (from useBuildEvaluation)
function convertGemStatesToUpgrades(gemStates, upgrades) {
  if (!gemStates) return;
  
  // Stelle sicher dass gems_nodes existiert und leere es komplett
  upgrades.gems_nodes = {};
  
  // Mapping von gemPlannerStore upgrade IDs zu upgrades.gems_nodes keys
  const upgradeMapping = {
    // Attraction Gem Upgrades
    'borge-loot-bonus': 'attraction_lootBorge',
    'ozzy-loot-bonus': 'attraction_lootOzzy', 
    'catch-up-power': 'attraction_catchUp',
    
    // Creation Gem Upgrades
    'borge-stat-bonus': 'creation_borgeGU',
    'ozzy-stat-bonus': 'creation_ozzyGU',
    'knox-stat-bonus': 'creation_knoxGU',
  };
  
  // Konvertiere alle Gem-Daten
  Object.entries(gemStates).forEach(([gemId, gemState]) => {
    if (!gemState) return;
    
    // Konvertiere Gem Level
    if (gemState.level > 0) {
      upgrades.gems_nodes[`${gemId}_level`] = gemState.level;
    } else {
      upgrades.gems_nodes[`${gemId}_level`] = 0;
    }
    
    // Konvertiere Gem Nodes (boolean array zu gem1, gem2, gem3)
    if (Array.isArray(gemState.nodes)) {
      gemState.nodes.forEach((hasNode, index) => {
        upgrades.gems_nodes[`${gemId}_gem${index + 1}`] = hasNode ? 1 : 0;
      });
    }
    
    // Konvertiere Gem Upgrades
    if (gemState.upgrades) {
      Object.entries(gemState.upgrades).forEach(([upgradeId, level]) => {
        const mappedKey = upgradeMapping[upgradeId];
        if (mappedKey) {
          upgrades.gems_nodes[mappedKey] = level;
        } else {
          upgrades.gems_nodes[`${gemId}_${upgradeId}`] = level;
        }
      });
    }
  });
}

// Computed
const buildCode = computed(() => {
  if (!props.build) return '';
  
  // Get store data for encoding - inklusive Gem Planner Data
  const storeData = {
    hunterStats: { ...hunterStore.hunterStats },
    upgrades: { ...hunterStore.upgrades }
  };
  
  // Konvertiere Gem Planner Store Daten in upgrades.gems_nodes Format
  if (gemPlannerStore.gemStates) {
    convertGemStatesToUpgrades(gemPlannerStore.gemStates, storeData.upgrades);
  }
  
  // Apply build-specific overrides to storeData for correct export
  if (props.build.overrides) {
    Object.entries(props.build.overrides).forEach(([key, value]) => {
      if (key.startsWith('upgrades.')) {
        const parts = key.split('.');
        
        if (parts.length === 3) {
          const [_, category, itemKey] = parts;
          if (!storeData.upgrades[category]) {
            storeData.upgrades[category] = {};
          }
          storeData.upgrades[category][itemKey] = value;
        } else if (parts.length === 4) {
          const [_, category, subcategory, itemKey] = parts;
          if (!storeData.upgrades[category]) {
            storeData.upgrades[category] = {};
          }
          if (!storeData.upgrades[category][subcategory]) {
            storeData.upgrades[category][subcategory] = {};
          }
          storeData.upgrades[category][subcategory][itemKey] = value;
        }
      }
    });
  }
  
  return BuildCodeHandler.generateCode(props.build, storeData) || '';
});

const discordCode = computed(() => {
  if (!props.build) return '';
  
  try {
    const rawBuildCode = buildCode.value;
    
    // Get hunter info using getHunterById
    const hunterId = props.build.hunter || props.build.hunterId;
    const hunterInfo = getHunterById(hunterId);
    const hunterName = hunterInfo.name;
    const hunterLevelEmoji = hunterInfo.discord_level_image || '⭐';
    
    // Build basic info
    const buildName = props.build.name || 'Unnamed Build';
    const buildLevel = props.build.level || 'Unknown';
    
    // Get loot score from results if available
    let lootScore = 'N/A';
    
    // Check both props.results and props.build.results
    const buildResults = props.results || props.build.results;
    if (buildResults && typeof buildResults.lootPerMin === 'number') {
      lootScore = formatNumber(buildResults.lootPerMin);
    }
    
    // Create Discord format with build stats
    return `**${hunterName}** • ${hunterLevelEmoji} Level ${buildLevel} • 💰 ${lootScore} Loot Score
\`\`\`
${rawBuildCode}
\`\`\``;
  } catch (error) {
    console.error('Error generating Discord formatted code:', error);
    return buildCode.value;
  }
});

const currentCode = computed(() => {
  return codeFormat.value === 'discord' ? discordCode.value : buildCode.value;
});

const shareLink = computed(() => {
  if (!buildCode.value) return '';
  // The URL of the application + a parameter for the build code
  return `${window.location.origin}/${props.build?.hunter || props.build?.hunterId}?code=${encodeURIComponent(buildCode.value)}`;
});

// Methods
const selectCode = () => {
  if (codeTextarea.value) {
    codeTextarea.value.select();
  }
};

const selectLink = () => {
  if (linkInput.value) {
    linkInput.value.select();
  }
};

const copyRawCode = async () => {
  codeFormat.value = 'raw';
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(buildCode.value);
    } else {
      selectCode();
      document.execCommand('copy');
    }
    rawCopied.value = true;
    setTimeout(() => { rawCopied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy raw code:', err);
    // Fallback
    try {
      selectCode();
      const success = document.execCommand('copy');
      if (success) {
        rawCopied.value = true;
        setTimeout(() => { rawCopied.value = false; }, 2000);
      }
    } catch (execErr) {
      console.error('Copy failed:', execErr);
      alert('Copying failed. Please copy manually.');
    }
  }
};

const copyDiscordCode = async () => {
  codeFormat.value = 'discord';
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(discordCode.value);
    } else {
      selectCode();
      document.execCommand('copy');
    }
    discordCopied.value = true;
    setTimeout(() => { discordCopied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy Discord code:', err);
    // Fallback
    try {
      selectCode();
      const success = document.execCommand('copy');
      if (success) {
        discordCopied.value = true;
        setTimeout(() => { discordCopied.value = false; }, 2000);
      }
    } catch (execErr) {
      console.error('Copy failed:', execErr);
      alert('Copying failed. Please copy manually.');
    }
  }
};

const copyLinkToClipboard = async () => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Moderne Clipboard API verwenden
      await navigator.clipboard.writeText(shareLink.value);
    } else {
      // Fallback mit document.execCommand
      selectLink();
      document.execCommand('copy');
    }
    linkCopied.value = true;
    setTimeout(() => { linkCopied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy link to clipboard:', err);
    // Fallback-Strategie bei Fehler
    try {
      selectLink();
      const success = document.execCommand('copy');
      if (success) {
        linkCopied.value = true;
        setTimeout(() => { linkCopied.value = false; }, 2000);
      } else {
        console.warn('execCommand copy returned false');
      }
    } catch (execErr) {
      console.error('Both clipboard methods failed:', execErr);
      alert('Copying link to clipboard failed. Please copy manually.');
    }
  }
};

// Reset functionality when the modal is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    rawCopied.value = false;
    discordCopied.value = false;
    linkCopied.value = false;
    codeFormat.value = 'raw';
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