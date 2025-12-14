<template>
  <div class="bg-gray-800/50 rounded-b-lg border border-gray-700/50 border-t-0 overflow-hidden p-3">
    <!-- Summary Bar -->
    <div class="bg-gray-900/50 rounded-lg p-3 mb-3 border border-gray-700/50">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Fill Order Setting -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 font-semibold">Campaign Fill Order:</span>
          <select
            :value="missionPlannerStore.campaignFillOrder"
            @change="updateCampaignFillOrder($event.target.value)"
            class="w-14 px-1 py-1 bg-gray-900 border border-gray-600 rounded text-white text-xs text-center focus:border-purple-500 outline-none cursor-pointer"
          >
            <option v-for="n in 17" :key="n" :value="n">{{ n }}</option>
          </select>
          <span class="text-[10px] text-gray-500">(after {{ missionPlannerStore.campaignFillOrder - 1 }} farm missions)</span>
        </div>

        <!-- Total Completion Time -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 font-semibold">All Campaigns Time:</span>
          <span class="text-purple-400 font-bold text-sm">{{ totalCompletionTimeFormatted }}</span>
        </div>
        
        <!-- Reset All Timers Button -->
        <button
          v-if="hasAnyTimer"
          @click="resetAllTimers"
          class="px-2 py-1 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-colors flex items-center gap-1"
        >
          <IconRefresh size="12" />
          Reset All Timers
        </button>
      </div>
    </div>

    <!-- Campaigns Table -->
    <div class="overflow-x-auto">
      <table class="text-xs table-fixed w-full rounded-lg overflow-hidden">
        <thead class="bg-gray-700/80 text-gray-300">
          <tr>
            <th class="px-2 py-1.5 text-center w-[8%] rounded-tl-lg">Timer</th>
            <th class="px-2 py-1.5 text-left w-[10%]">Campaign</th>
            <th class="px-2 py-1.5 text-right w-[12%]">Max Crew</th>
            <th class="px-2 py-1.5 text-right w-[12%]">Assigned</th>
            <th class="px-2 py-1.5 text-right w-[18%]">Time / Remaining</th>
            <th class="px-2 py-1.5 text-right w-[18%] rounded-tr-lg">
              <div class="flex items-center justify-end gap-1">
                <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
                <span>Frags</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(campaigns, planetIndex) in campaignsByPlanet" :key="planetIndex">
            <!-- Planet Header Row -->
            <tr class="bg-gray-700/50">
              <td colspan="6" class="px-2 py-1 font-semibold text-purple-400">
                <IconPlanet size="12" class="inline mr-1 -mt-0.5" />
                {{ campaigns[0]?.planet || 'Unknown' }}
                <span class="text-gray-500 font-normal ml-2">
                  ({{ formatTime(getPlanetTotalTime(campaigns)) }} · 
                  <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3 h-3 inline -mt-0.5" />
                  {{ formatNumber(getPlanetTotalFrags(campaigns)) }})
                </span>
              </td>
            </tr>
            <!-- Campaign Rows -->
            <tr 
              v-for="(campaign, index) in campaigns" 
              :key="campaign.tag"
              :class="[
                index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50',
                getTimerState(campaign.tag) === 'completed' ? 'bg-green-900/20' : '',
                getTimerState(campaign.tag) === 'running' ? 'bg-blue-900/20' : ''
              ]"
            >
              <!-- Timer Controls -->
              <td class="px-2 py-1.5 text-center">
                <div class="flex items-center justify-center gap-1">
                  <!-- Play Button (only if not running/completed) -->
                  <button
                    v-if="getTimerState(campaign.tag) === 'idle'"
                    @click="startTimer(campaign.tag, campaign.completionTimeMinutes)"
                    class="p-1 rounded hover:bg-green-600/30 text-green-400 transition-colors"
                    title="Start Timer"
                  >
                    <IconPlayerPlay size="14" />
                  </button>
                  
                  <!-- Running indicator -->
                  <span 
                    v-else-if="getTimerState(campaign.tag) === 'running'"
                    class="text-blue-400"
                  >
                    <IconClock size="14" class="animate-pulse" />
                  </span>
                  
                  <!-- Completed indicator -->
                  <span 
                    v-else-if="getTimerState(campaign.tag) === 'completed'"
                    class="text-green-400"
                  >
                    <IconCheck size="14" />
                  </span>
                  
                  <!-- Reset Button (if running or completed) -->
                  <button
                    v-if="getTimerState(campaign.tag) !== 'idle'"
                    @click="resetTimer(campaign.tag)"
                    class="p-1 rounded hover:bg-red-600/30 text-red-400 transition-colors"
                    title="Reset Timer"
                  >
                    <IconX size="12" />
                  </button>
                </div>
              </td>
              
              <td class="px-2 py-1.5 font-mono text-white">{{ campaign.tag }}</td>
              <td class="px-2 py-1.5 text-right text-gray-400">{{ formatCrew(campaign.adjustedMaxCrew) }}</td>
              <td class="px-2 py-1.5 text-right" :class="campaign.crewUsed >= campaign.adjustedMaxCrew ? 'text-green-400' : campaign.crewUsed > 0 ? 'text-yellow-400' : 'text-red-400'">
                {{ formatCrew(campaign.crewUsed) }}
              </td>
              
              <!-- Time / Remaining -->
              <td class="px-2 py-1.5 text-right font-mono font-semibold">
                <span v-if="getTimerState(campaign.tag) === 'running'" class="text-blue-400">
                  {{ formatCountdown(getRemainingTime(campaign.tag)) }}
                </span>
                <span v-else-if="getTimerState(campaign.tag) === 'completed'" class="text-green-400">
                  ✓ Done
                </span>
                <span v-else class="text-white">
                  {{ campaign.completionTimeFormatted }}
                </span>
              </td>
              
              <td class="px-2 py-1.5 text-right text-amber-400 font-mono">{{ formatNumber(campaign.fragsPerCompletion) }}</td>
            </tr>
          </template>
        </tbody>
        <!-- Footer with Totals -->
        <tfoot class="bg-gray-700/60 border-t border-gray-600">
          <tr>
            <td colspan="4" class="px-2 py-2 text-right font-semibold text-gray-300">Total All Campaigns:</td>
            <td class="px-2 py-2 text-right text-purple-400 font-bold font-mono">{{ totalCompletionTimeFormatted }}</td>
            <td class="px-2 py-2 text-right text-amber-400 font-bold font-mono">
              <div class="flex items-center justify-end gap-1">
                <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
                <span>{{ formatNumber(totalFragments) }}</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconPlanet, IconPlayerPlay, IconClock, IconCheck, IconX, IconRefresh } from '@tabler/icons-vue';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { CAMPAIGN_MISSIONS } from '../constants/missions';
import { formatNumber } from '@/composables/format';

const missionPlannerStore = useMissionPlannerStore();

// ============================================
// TIMER FUNCTIONS (delegated to store for global background operation)
// ============================================

function startTimer(campaignTag, durationMinutes) {
  missionPlannerStore.startCampaignTimer(campaignTag, durationMinutes);
}

function resetTimer(campaignTag) {
  missionPlannerStore.resetCampaignTimer(campaignTag);
}

function resetAllTimers() {
  missionPlannerStore.resetAllCampaignTimers();
}

function getTimerState(campaignTag) {
  return missionPlannerStore.getCampaignTimerState(campaignTag);
}

function getRemainingTime(campaignTag) {
  return missionPlannerStore.getCampaignRemainingTime(campaignTag);
}

// Check if any timer exists
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

// Format crew values - no decimals under 1000
function formatCrew(value) {
  if (value < 1000) {
    return Math.floor(value).toString();
  }
  return formatNumber(value, 0);
}

// ============================================
// EXISTING LOGIC
// ============================================

// Get remaining personnel based on campaign fill order position
const remainingPersonnel = computed(() => {
  const fillOrderPos = missionPlannerStore.campaignFillOrder;
  return missionPlannerStore.getPersonnelAtFillOrderPosition(fillOrderPos);
});

// Calculate stats for each campaign using REMAINING personnel (after farm allocation)
// Campaigns run SEQUENTIALLY - personnel is reused for each campaign
// Uses OPTIMAL_CAMPAIGN_ORDER from store for proper fragment calculation
const campaignsWithStats = computed(() => {
  const powerPerTier = missionPlannerStore.powerPerTier;
  const missionSpeed = missionPlannerStore.missionSpeedMultiplier;
  const r11Multiplier = missionPlannerStore.relicEffectsBreakdown?.campaignMaxCrewMultiplier || 1;
  
  // Get optimal order and final multipliers from store
  const OPTIMAL_ORDER = missionPlannerStore.OPTIMAL_CAMPAIGN_ORDER;
  const FINAL_MULTIPLIERS = missionPlannerStore.CAMPAIGN_FINAL_MULTIPLIERS;
  
  // Personnel remaining after farm missions - reused for EACH campaign (sequential)
  const available = { ...remainingPersonnel.value };
  
  // Calculate stats for each campaign in optimal order (for correct frag calculation)
  const statsByTag = {};
  
  OPTIMAL_ORDER.forEach((tag, orderIndex) => {
    const campaign = CAMPAIGN_MISSIONS.find(c => c.tag === tag);
    if (!campaign) return;
    
    // Apply R11 bonus to maxCrew
    const adjustedMaxCrew = Math.floor(campaign.maxCrew * r11Multiplier);
    
    // Calculate how much personnel we can use (up to adjustedMaxCrew)
    // Personnel is REUSED for each campaign - we use the same pool every time
    let crewUsed = 0;
    let totalPower = 0;
    const usedPersonnel = { T1: 0, T2: 0, T3: 0, T4: 0 };
    
    // Fill with available personnel, starting with T1 (cheapest)
    for (const tier of ['T1', 'T2', 'T3', 'T4']) {
      const availableOfTier = available[tier] || 0;
      const spaceLeft = adjustedMaxCrew - crewUsed;
      const toAssign = Math.min(availableOfTier, spaceLeft);
      
      if (toAssign > 0) {
        usedPersonnel[tier] = toAssign;
        crewUsed += toAssign;
        totalPower += toAssign * (powerPerTier[tier] || 0);
        // DO NOT subtract - personnel is reused for next campaign!
      }
      
      if (crewUsed >= adjustedMaxCrew) break;
    }
    
    // Calculate completion time (always calculate as reference, even without crew)
    let completionTimeMinutes = campaign.timeInMinutes;
    if (totalPower > 0 && missionSpeed > 0) {
      completionTimeMinutes = campaign.timeInMinutes / (totalPower * missionSpeed);
    }
    
    // Get final multiplier for this campaign (CX-12 missions)
    const finalMultiplier = FINAL_MULTIPLIERS[tag] || 1;
    
    // Calculate fragments using store function (accounts for completed_campaigns index)
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
  
  // Return campaigns in display order (C1-1 to C4-12)
  return CAMPAIGN_MISSIONS.map(campaign => statsByTag[campaign.tag]);
});

// Group campaigns by planet
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

// Calculate total completion time for all campaigns
const totalCompletionTime = computed(() => {
  // If any campaign has no crew assigned (totalPower === 0), return Infinity
  const hasNoCrew = campaignsWithStats.value.some(c => c.totalPower === 0);
  if (hasNoCrew) return Infinity;
  return campaignsWithStats.value.reduce((total, c) => total + c.completionTimeMinutes, 0);
});

const totalCompletionTimeFormatted = computed(() => {
  return formatTime(totalCompletionTime.value);
});

// Calculate total fragments from all campaigns
const totalFragments = computed(() => {
  return campaignsWithStats.value.reduce((total, c) => total + c.fragsPerCompletion, 0);
});

// Get total time for a planet's campaigns
function getPlanetTotalTime(campaigns) {
  return campaigns.reduce((total, c) => total + c.completionTimeMinutes, 0);
}

// Get total fragments for a planet's campaigns
function getPlanetTotalFrags(campaigns) {
  return campaigns.reduce((total, c) => total + c.fragsPerCompletion, 0);
}

// Format time from minutes to human-readable string (max unit: hours)
function formatTime(minutes) {
  if (!isFinite(minutes)) return '∞';
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
  
  // Always show hours, even for large values
  const hours = minutes / 60;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// Update campaign fill order
function updateCampaignFillOrder(value) {
  const newValue = parseInt(value, 10);
  missionPlannerStore.setCampaignFillOrder(newValue);
}
</script>
