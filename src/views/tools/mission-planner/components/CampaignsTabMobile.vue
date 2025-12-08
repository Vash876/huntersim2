<template>
  <div class="flex flex-col gap-3">
    <!-- Summary Bar -->
    <div class="bg-gray-800/70 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
      <!-- Fill Order & Actions Row -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400">Fill Order:</span>
          <select
            :value="missionPlannerStore.campaignFillOrder"
            @change="updateCampaignFillOrder($event.target.value)"
            class="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
          >
            <option :value="1">After all farms</option>
            <option :value="2">After F3-4</option>
            <option :value="3">After F2-4</option>
            <option :value="4">After F1-4</option>
            <option :value="5">No farms</option>
          </select>
        </div>
        <button
          v-if="hasAnyTimer"
          @click="resetAllTimers"
          class="px-2 py-1 text-xs bg-red-600/30 text-red-300 rounded hover:bg-red-600/50 transition-colors"
        >
          Reset All
        </button>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 gap-2 text-center">
        <div class="bg-gray-900/50 rounded-lg p-2">
          <div class="text-xs text-gray-400">Remaining Personnel</div>
          <div class="text-sm font-bold text-white">
            {{ formatNumber(totalRemainingPersonnel) }}
          </div>
        </div>
        <div class="bg-gray-900/50 rounded-lg p-2">
          <div class="text-xs text-gray-400">Total Time</div>
          <div class="text-sm font-bold text-amber-400">
            {{ totalCompletionTimeFormatted }}
          </div>
        </div>
      </div>
    </div>

    <!-- Planet Groups -->
    <div v-for="(campaigns, planetIndex) in campaignsByPlanet" :key="planetIndex" class="flex flex-col gap-2">
      <!-- Planet Header -->
      <div :class="[
        'flex items-center justify-between px-3 py-2 rounded-lg',
        planetIndex === 0 ? 'bg-emerald-900/30 border border-emerald-700/30' :
        planetIndex === 1 ? 'bg-blue-900/30 border border-blue-700/30' :
        planetIndex === 2 ? 'bg-purple-900/30 border border-purple-700/30' :
        'bg-amber-900/30 border border-amber-700/30'
      ]">
        <span :class="[
          'text-sm font-semibold',
          planetIndex === 0 ? 'text-emerald-300' :
          planetIndex === 1 ? 'text-blue-300' :
          planetIndex === 2 ? 'text-purple-300' :
          'text-amber-300'
        ]">
          {{ campaigns[0]?.planet || `Planet ${planetIndex + 1}` }}
        </span>
        <div class="flex items-center gap-3 text-xs">
          <span class="text-gray-400">
            {{ formatTime(getPlanetTotalTime(campaigns)) }}
          </span>
          <span class="text-yellow-400">
            {{ formatNumber(getPlanetTotalFrags(campaigns)) }} frags
          </span>
        </div>
      </div>

      <!-- Campaign Cards -->
      <div v-for="campaign in campaigns" :key="campaign.tag" class="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40">
        <!-- Campaign Header with Timer -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <!-- Timer Button -->
            <button
              @click="toggleTimer(campaign.tag, campaign.completionTimeMinutes)"
              :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                getTimerState(campaign.tag) === 'completed' ? 'bg-green-600/30 text-green-400' :
                getTimerState(campaign.tag) === 'running' ? 'bg-blue-600/30 text-blue-400' :
                'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
              ]"
            >
              <IconCheck v-if="getTimerState(campaign.tag) === 'completed'" :size="16" />
              <IconClock v-else-if="getTimerState(campaign.tag) === 'running'" :size="16" />
              <IconPlayerPlay v-else :size="16" />
            </button>
            
            <!-- Campaign Tag -->
            <span class="text-white font-semibold">{{ campaign.tag }}</span>
            
            <!-- Final Mission Badge -->
            <span
              v-if="campaign.finalMultiplier > 1"
              class="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded"
            >
              ×{{ campaign.finalMultiplier }}
            </span>
          </div>

          <!-- Reset Timer Button -->
          <button
            v-if="getTimerState(campaign.tag) !== 'idle'"
            @click.stop="resetTimer(campaign.tag)"
            class="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
          >
            <IconX :size="14" />
          </button>
        </div>

        <!-- Countdown (when running) -->
        <div
          v-if="getTimerState(campaign.tag) === 'running'"
          class="mb-2 text-center py-2 bg-blue-900/30 rounded-lg border border-blue-700/30"
        >
          <span class="text-blue-300 font-mono text-lg">
            {{ formatCountdown(getRemainingTime(campaign.tag)) }}
          </span>
        </div>

        <!-- Campaign Stats Grid -->
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <!-- Max Crew -->
          <div class="bg-gray-900/50 rounded px-2 py-1.5">
            <div class="text-gray-500 mb-0.5">Max Crew</div>
            <div class="text-white font-medium">
              {{ formatNumber(campaign.adjustedMaxCrew) }}
              <span v-if="campaign.adjustedMaxCrew !== campaign.maxCrew" class="text-green-400 text-[10px]">
                (+{{ formatNumber(campaign.adjustedMaxCrew - campaign.maxCrew) }})
              </span>
            </div>
          </div>
          
          <!-- Assigned -->
          <div class="bg-gray-900/50 rounded px-2 py-1.5">
            <div class="text-gray-500 mb-0.5">Assigned</div>
            <div :class="[
              'font-medium',
              campaign.crewUsed >= campaign.adjustedMaxCrew ? 'text-green-400' :
              campaign.crewUsed > 0 ? 'text-yellow-400' : 'text-red-400'
            ]">
              {{ formatNumber(campaign.crewUsed) }}
            </div>
          </div>
          
          <!-- Time -->
          <div class="bg-gray-900/50 rounded px-2 py-1.5">
            <div class="text-gray-500 mb-0.5">Time</div>
            <div class="text-amber-400 font-medium">{{ campaign.completionTimeFormatted }}</div>
          </div>
        </div>

        <!-- Fragments Row -->
        <div class="mt-2 flex items-center justify-center gap-1 py-1.5 bg-yellow-900/20 rounded border border-yellow-700/20">
          <span class="text-yellow-400 font-semibold text-sm">
            {{ formatNumber(campaign.fragsPerCompletion) }}
          </span>
          <span class="text-yellow-600 text-xs">fragments</span>
        </div>
      </div>
    </div>

    <!-- Total Summary -->
    <div class="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl p-3 border border-gray-600/50">
      <div class="flex items-center justify-between">
        <span class="text-gray-300 font-medium">Total All Campaigns</span>
        <div class="flex items-center gap-4">
          <span class="text-amber-400 font-bold">{{ totalCompletionTimeFormatted }}</span>
          <span class="text-yellow-400 font-bold">{{ formatNumber(totalFragments) }} frags</span>
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
