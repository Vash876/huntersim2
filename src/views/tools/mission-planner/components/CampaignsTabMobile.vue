<template>
  <div class="flex flex-col gap-2">
    <!-- Summary Bar -->
    <div class="bg-gray-800/70 backdrop-blur-sm rounded-lg p-2 border border-gray-700/50">
      <!-- Fill Order & Stats Row -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-gray-400">Fill:</span>
          <select
            :value="missionPlannerStore.campaignFillOrder"
            @change="updateCampaignFillOrder($event.target.value)"
            class="bg-gray-700 border border-gray-600 rounded px-1.5 py-0.5 text-[10px] text-white w-10 text-center"
          >
            <option v-for="n in 17" :key="n" :value="n">{{ n }}</option>
          </select>
          <span class="text-gray-500">|</span>
          <span class="text-[10px] text-gray-400">{{ formatNumber(totalRemainingPersonnel) }} crew</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-amber-400 font-semibold">{{ totalCompletionTimeFormatted }}</span>
          <span class="text-gray-500">|</span>
          <span class="text-[10px] text-yellow-400 font-semibold">{{ formatNumber(totalFragments) }}</span>
          <button
            v-if="hasAnyTimer"
            @click="resetAllTimers"
            class="px-1.5 py-0.5 text-[10px] bg-red-600/30 text-red-300 rounded hover:bg-red-600/50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Planet Groups -->
    <div v-for="(campaigns, planetIndex) in campaignsByPlanet" :key="planetIndex" class="flex flex-col gap-1">
      <!-- Planet Header -->
      <div :class="[
        'flex items-center justify-between px-2 py-1 rounded-lg',
        planetIndex === 0 ? 'bg-emerald-900/30 border border-emerald-700/30' :
        planetIndex === 1 ? 'bg-blue-900/30 border border-blue-700/30' :
        planetIndex === 2 ? 'bg-purple-900/30 border border-purple-700/30' :
        'bg-amber-900/30 border border-amber-700/30'
      ]">
        <span :class="[
          'text-xs font-semibold',
          planetIndex === 0 ? 'text-emerald-300' :
          planetIndex === 1 ? 'text-blue-300' :
          planetIndex === 2 ? 'text-purple-300' :
          'text-amber-300'
        ]">
          {{ campaigns[0]?.planet || `Planet ${planetIndex + 1}` }}
        </span>
        <div class="flex items-center gap-2 text-[10px]">
          <span class="text-gray-400">{{ formatTime(getPlanetTotalTime(campaigns)) }}</span>
          <span class="text-yellow-400">{{ formatNumber(getPlanetTotalFrags(campaigns)) }}</span>
        </div>
      </div>

      <!-- Campaign Cards - Compact -->
      <div class="space-y-1">
        <div 
          v-for="campaign in campaigns" 
          :key="campaign.tag" 
          class="bg-gray-800/60 rounded-lg p-2 border border-gray-700/40"
        >
          <!-- Single Row Layout -->
          <div class="flex items-center justify-between">
            <!-- Left: Timer + Tag + Badge -->
            <div class="flex items-center gap-1.5">
              <button
                @click="toggleTimer(campaign.tag, campaign.completionTimeMinutes)"
                :class="[
                  'w-6 h-6 rounded flex items-center justify-center transition-colors',
                  getTimerState(campaign.tag) === 'completed' ? 'bg-green-600/30 text-green-400' :
                  getTimerState(campaign.tag) === 'running' ? 'bg-blue-600/30 text-blue-400' :
                  'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                ]"
              >
                <IconCheck v-if="getTimerState(campaign.tag) === 'completed'" :size="12" />
                <IconClock v-else-if="getTimerState(campaign.tag) === 'running'" :size="12" />
                <IconPlayerPlay v-else :size="12" />
              </button>
              
              <span class="text-white font-semibold text-sm">{{ campaign.tag }}</span>
              
              <span
                v-if="campaign.finalMultiplier > 1"
                class="text-[9px] px-1 py-0.5 bg-yellow-500/20 text-yellow-400 rounded"
              >
                ×{{ campaign.finalMultiplier }}
              </span>
              
              <button
                v-if="getTimerState(campaign.tag) !== 'idle'"
                @click.stop="resetTimer(campaign.tag)"
                class="p-0.5 text-gray-500 hover:text-red-400"
              >
                <IconX :size="12" />
              </button>
            </div>

            <!-- Right: Stats -->
            <div class="flex items-center gap-2 text-[10px]">
              <!-- Crew -->
              <span :class="[
                'font-mono',
                campaign.crewUsed >= campaign.adjustedMaxCrew ? 'text-green-400' :
                campaign.crewUsed > 0 ? 'text-yellow-400' : 'text-gray-500'
              ]">
                {{ formatNumber(campaign.crewUsed) }}/{{ formatNumber(campaign.adjustedMaxCrew) }}
              </span>
              <span class="text-gray-500">|</span>
              <!-- Time -->
              <span class="text-amber-400 font-mono">{{ campaign.completionTimeFormatted }}</span>
              <span class="text-gray-500">|</span>
              <!-- Frags -->
              <span class="text-yellow-400 font-semibold">{{ formatNumber(campaign.fragsPerCompletion) }}</span>
            </div>
          </div>

          <!-- Countdown Row (only when running) -->
          <div
            v-if="getTimerState(campaign.tag) === 'running'"
            class="mt-1.5 text-center py-1 bg-blue-900/30 rounded border border-blue-700/30"
          >
            <span class="text-blue-300 font-mono text-sm">
              {{ formatCountdown(getRemainingTime(campaign.tag)) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconPlayerPlay, IconClock, IconCheck, IconX } from '@tabler/icons-vue';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { CAMPAIGN_MISSIONS } from '../constants/missions';

const missionPlannerStore = useMissionPlannerStore();

// ============================================
// TIMER FUNCTIONS
// ============================================

function getTimerState(campaignTag) {
  return missionPlannerStore.getCampaignTimerState(campaignTag);
}

function toggleTimer(campaignTag, completionTimeMinutes) {
  const state = getTimerState(campaignTag);
  if (state === 'idle') {
    // Request notification permission on mobile when starting timer
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    missionPlannerStore.startCampaignTimer(campaignTag, completionTimeMinutes);
  }
}

function resetTimer(campaignTag) {
  missionPlannerStore.resetCampaignTimer(campaignTag);
}

function resetAllTimers() {
  missionPlannerStore.resetAllCampaignTimers();
}

function getRemainingTime(campaignTag) {
  return missionPlannerStore.getCampaignRemainingTime(campaignTag);
}

const hasAnyTimer = computed(() => missionPlannerStore.hasAnyCampaignTimer);

// ============================================
// COUNTDOWN FORMATTING
// ============================================

function formatCountdown(seconds) {
  if (seconds <= 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

// ============================================
// PERSONNEL & STATS
// ============================================

const remainingPersonnel = computed(() => {
  const fillOrderPos = missionPlannerStore.campaignFillOrder;
  return missionPlannerStore.getPersonnelAtFillOrderPosition(fillOrderPos);
});

const totalRemainingPersonnel = computed(() => {
  const p = remainingPersonnel.value;
  return (p.T1 || 0) + (p.T2 || 0) + (p.T3 || 0) + (p.T4 || 0);
});

const campaignsWithStats = computed(() => {
  const powerPerTier = missionPlannerStore.powerPerTier;
  const missionSpeed = missionPlannerStore.missionSpeedMultiplier;
  const r11Multiplier = missionPlannerStore.relicEffectsBreakdown?.campaignMaxCrewMultiplier || 1;
  
  const OPTIMAL_ORDER = missionPlannerStore.OPTIMAL_CAMPAIGN_ORDER;
  const FINAL_MULTIPLIERS = missionPlannerStore.CAMPAIGN_FINAL_MULTIPLIERS;
  
  const available = { ...remainingPersonnel.value };
  const statsByTag = {};
  
  OPTIMAL_ORDER.forEach((tag, orderIndex) => {
    const campaign = CAMPAIGN_MISSIONS.find(c => c.tag === tag);
    if (!campaign) return;
    
    const adjustedMaxCrew = Math.floor(campaign.maxCrew * r11Multiplier);
    
    let crewUsed = 0;
    let totalPower = 0;
    const usedPersonnel = { T1: 0, T2: 0, T3: 0, T4: 0 };
    
    for (const tier of ['T1', 'T2', 'T3', 'T4']) {
      const availableOfTier = available[tier] || 0;
      const spaceLeft = adjustedMaxCrew - crewUsed;
      const toAssign = Math.min(availableOfTier, spaceLeft);
      
      if (toAssign > 0) {
        usedPersonnel[tier] = toAssign;
        crewUsed += toAssign;
        totalPower += toAssign * (powerPerTier[tier] || 0);
      }
      
      if (crewUsed >= adjustedMaxCrew) break;
    }
    
    let completionTimeMinutes = campaign.timeInMinutes;
    if (totalPower > 0 && missionSpeed > 0) {
      completionTimeMinutes = campaign.timeInMinutes / (totalPower * missionSpeed);
    }
    
    const finalMultiplier = FINAL_MULTIPLIERS[tag] || 1;
    const baseFrags = missionPlannerStore.calculateCampaignFragsForIndex(orderIndex);
    const fragsPerCompletion = baseFrags * finalMultiplier;
    
    statsByTag[tag] = {
      ...campaign,
      adjustedMaxCrew,
      crewUsed,
      totalPower,
      usedPersonnel,
      completionTimeMinutes,
      completionTimeFormatted: formatTime(completionTimeMinutes),
      fragsPerCompletion,
      finalMultiplier,
      orderIndex,
    };
  });
  
  return CAMPAIGN_MISSIONS.map(campaign => statsByTag[campaign.tag]);
});

const campaignsByPlanet = computed(() => {
  const grouped = {};
  for (const campaign of campaignsWithStats.value) {
    if (!grouped[campaign.planet]) {
      grouped[campaign.planet] = [];
    }
    grouped[campaign.planet].push(campaign);
  }
  return Object.values(grouped);
});

const totalCompletionTime = computed(() => {
  return campaignsWithStats.value.reduce((total, c) => total + c.completionTimeMinutes, 0);
});

const totalCompletionTimeFormatted = computed(() => {
  return formatTime(totalCompletionTime.value);
});

const totalFragments = computed(() => {
  return campaignsWithStats.value.reduce((total, c) => total + c.fragsPerCompletion, 0);
});

function getPlanetTotalTime(campaigns) {
  return campaigns.reduce((total, c) => total + c.completionTimeMinutes, 0);
}

function getPlanetTotalFrags(campaigns) {
  return campaigns.reduce((total, c) => total + c.fragsPerCompletion, 0);
}

// ============================================
// FORMATTING
// ============================================

function formatTime(minutes) {
  if (!minutes || minutes <= 0) return '-';
  
  const totalSeconds = minutes * 60;
  
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }
  
  if (minutes < 60) {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  
  const hours = minutes / 60;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return Math.floor(num).toLocaleString();
}

function updateCampaignFillOrder(value) {
  const newValue = parseInt(value, 10);
  missionPlannerStore.setCampaignFillOrder(newValue);
}
</script>
