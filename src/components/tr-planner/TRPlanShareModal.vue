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
          Share TR Plan
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
        
        <div class="p-3 bg-blue-900/20 border border-blue-500/30 rounded-md">
          <p class="text-xs text-blue-300 mb-1">
            <strong>{{ codeFormat === 'discord' ? 'Discord Format:' : 'Raw Format:' }}</strong>
          </p>
          <p class="text-xs text-gray-400">
            {{ codeFormat === 'discord' 
                ? 'Includes plan name and Discord code block formatting for easy sharing.' 
                : 'Pure plan code for direct import into the TR planner.' 
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconShare, IconX, IconCopy, IconCheck, IconBrandDiscord } from '@tabler/icons-vue';
import { exportTRPlan } from '@/utils/trImportExport';
import { getGemDataFromLocalStorage } from '@/utils/gemDataUtils';
import { formatNumber } from '@/composables/format';

// Props
const props = defineProps({
  show: Boolean,
  plan: Object
});

// Emits
const emit = defineEmits(['close']);

// Refs
const codeTextarea = ref(null);
const rawCopied = ref(false);
const discordCopied = ref(false);
const codeFormat = ref('raw'); // 'raw' or 'discord'

// Computed
const rawCode = computed(() => {
  if (!props.plan) return '';
  
  try {
    let currentGemData = getGemDataFromLocalStorage();
    
    // WICHTIG: Plan gemOverrides haben Vorrang vor globalen Werten
    if (props.plan.gemOverrides && Object.keys(props.plan.gemOverrides).length > 0) {
      console.log('TRPlanShareModal: Applying gemOverrides to export');
      console.log('Original gem data:', currentGemData);
      console.log('Plan gemOverrides:', props.plan.gemOverrides);
      
      // Erstelle eine Kopie der globalen Gem-Daten
      currentGemData = {
        levels: { ...currentGemData.levels },
        activeNodes: { ...currentGemData.activeNodes }
      };
      
      // Wende Plan-spezifische Overrides an
      Object.entries(props.plan.gemOverrides).forEach(([key, value]) => {
        if (key.endsWith('Level')) {
          // Gem Level Override
          const gemId = key.replace('Level', '');
          currentGemData.levels[gemId] = value;
        } else if (key.includes('Node')) {
          // Gem Node Override
          const match = key.match(/^(.+)Node(\d+)$/);
          if (match) {
            const gemId = match[1];
            const nodeIndex = parseInt(match[2], 10);
            
            // Stelle sicher, dass das Array für den Gem existiert
            if (!currentGemData.activeNodes[gemId]) {
              currentGemData.activeNodes[gemId] = [];
            }
            
            if (value === 1 || value === true) {
              // Node aktivieren (falls nicht bereits aktiv)
              if (!currentGemData.activeNodes[gemId].includes(nodeIndex)) {
                currentGemData.activeNodes[gemId].push(nodeIndex);
              }
            } else {
              // Node deaktivieren (falls aktiv)
              const index = currentGemData.activeNodes[gemId].indexOf(nodeIndex);
              if (index !== -1) {
                currentGemData.activeNodes[gemId].splice(index, 1);
              }
            }
          }
        }
      });
      
      console.log('Final gem data with overrides:', currentGemData);
    }
    
    return exportTRPlan(props.plan, currentGemData) || '';
  } catch (error) {
    console.error('Error generating TR plan code:', error);
    return '';
  }
});

const discordCode = computed(() => {
  if (!props.plan) return '';
  
  try {
    let currentGemData = getGemDataFromLocalStorage();
    
    // WICHTIG: Plan gemOverrides haben Vorrang vor globalen Werten
    if (props.plan.gemOverrides && Object.keys(props.plan.gemOverrides).length > 0) {
      // Erstelle eine Kopie der globalen Gem-Daten
      currentGemData = {
        levels: { ...currentGemData.levels },
        activeNodes: { ...currentGemData.activeNodes }
      };
      
      // Wende Plan-spezifische Overrides an
      Object.entries(props.plan.gemOverrides).forEach(([key, value]) => {
        if (key.endsWith('Level')) {
          // Gem Level Override
          const gemId = key.replace('Level', '');
          currentGemData.levels[gemId] = value;
        } else if (key.includes('Node')) {
          // Gem Node Override
          const match = key.match(/^(.+)Node(\d+)$/);
          if (match) {
            const gemId = match[1];
            const nodeIndex = parseInt(match[2], 10);
            
            // Stelle sicher, dass das Array für den Gem existiert
            if (!currentGemData.activeNodes[gemId]) {
              currentGemData.activeNodes[gemId] = [];
            }
            
            if (value === 1 || value === true) {
              // Node aktivieren (falls nicht bereits aktiv)
              if (!currentGemData.activeNodes[gemId].includes(nodeIndex)) {
                currentGemData.activeNodes[gemId].push(nodeIndex);
              }
            } else {
              // Node deaktivieren (falls aktiv)
              const index = currentGemData.activeNodes[gemId].indexOf(nodeIndex);
              if (index !== -1) {
                currentGemData.activeNodes[gemId].splice(index, 1);
              }
            }
          }
        }
      });
    }
    
    const rawPlanCode = exportTRPlan(props.plan, currentGemData) || '';
    
    // Plan basic info
    const planName = props.plan.name || 'Unnamed TR Plan';
    const planDate = props.plan.trStartDate || 'Unknown Date';
    
    // Calculate additional stats (same logic as TRPlanCard)
    
    // Total TRs (1 + TR Chain length)
    let totalTRs = 1;
    if (props.plan.trChain && Array.isArray(props.plan.trChain)) {
      totalTRs += props.plan.trChain.filter(step => step && typeof step === 'object').length;
    }
    
    // Total Orb Gains
    let totalOrbGains = 0;
    if (props.plan.results && props.plan.results.orbGains) {
      totalOrbGains += props.plan.results.orbGains;
    }
    if (props.plan.trChain && Array.isArray(props.plan.trChain)) {
      props.plan.trChain.forEach(step => {
        if (step && step.results && step.results.orbGains) {
          totalOrbGains += step.results.orbGains;
        }
      });
    }
    
    // Total Fragment Gains
    let totalFragGains = 0;
    if (props.plan.results && props.plan.results.campaignFragGains) {
      totalFragGains += props.plan.results.campaignFragGains;
    }
    if (props.plan.trChain && Array.isArray(props.plan.trChain)) {
      props.plan.trChain.forEach(step => {
        if (step && step.results && step.results.campaignFragGains) {
          totalFragGains += step.results.campaignFragGains;
        }
      });
    }
    
    // Calculate duration
    let totalHours = 0;
    const hoursBoost = props.plan.boosts?.hoursInTR;
    if (hoursBoost) {
      totalHours += hoursBoost.targetLevel || 0;
    }
    if (props.plan.trChain && Array.isArray(props.plan.trChain)) {
      props.plan.trChain.forEach(step => {
        if (step) {
          const chainHoursBoost = step.boosts?.hoursInTR;
          if (chainHoursBoost) {
            totalHours += chainHoursBoost.targetLevel || 0;
          }
        }
      });
    }
    
    // Format duration
    let durationText = 'N/A';
    if (totalHours > 0) {
      if (totalHours < 24) {
        durationText = `${totalHours}h`;
      } else {
        const days = Math.floor(totalHours / 24);
        const remainingHours = totalHours % 24;
        if (remainingHours === 0) {
          durationText = `${days}d`;
        } else {
          durationText = `${days}d ${remainingHours}h`;
        }
      }
    }
    
    // Create Discord format with plan stats
    return `🎯 **${planName}** 📅 ${planDate}
📊 **Stats:** ${totalTRs} TRs • ${durationText} • :CIFI_ResourceOuroborosOrbsOO: ${formatNumber(totalOrbGains)} Orbs • :CIFI_ZeusFragments: ${formatNumber(totalFragGains)} Frags
\`\`\`
${rawPlanCode}
\`\`\``;
  } catch (error) {
    console.error('Error generating Discord formatted code:', error);
    return '';
  }
});

const currentCode = computed(() => {
  return codeFormat.value === 'discord' ? discordCode.value : rawCode.value;
});

// Methods
const selectCode = () => {
  if (codeTextarea.value) {
    codeTextarea.value.select();
  }
};

const copyRawCode = async () => {
  codeFormat.value = 'raw';
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(rawCode.value);
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

// Reset functionality when the modal is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    rawCopied.value = false;
    discordCopied.value = false;
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
