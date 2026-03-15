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
      </div>

      <!-- Campaign Order Preset Selector -->
      <div class="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-700/50">
        <span class="text-xs text-gray-400 font-semibold whitespace-nowrap">Run Order:</span>
        <div class="flex flex-wrap gap-1.5 items-start">
          <div
            v-for="(preset, index) in missionPlannerStore.CAMPAIGN_ORDER_PRESETS"
            :key="index"
            class="flex flex-col items-center gap-0.5"
          >
            <button
              @click="missionPlannerStore.setCampaignOrderPreset(index)"
              :title="preset.description"
              class="relative px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150"
              :class="missionPlannerStore.campaignOrderPreset === index
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'"
            >
              {{ preset.label }}
            </button>
            <span
              v-if="index === 0 && fragsPerPreset[0] != null"
              class="text-[10px] text-amber-400 font-semibold whitespace-nowrap">
              {{ formatFrags(fragsPerPreset[0]) }}</span>
            <span
              v-else-if="index > 0 && fragsPerPreset[index] != null && fragsPerPreset[index - 1] != null"
              class="text-[10px] text-green-400 font-semibold whitespace-nowrap"
            >+{{ formatFrags(fragsPerPreset[index] - fragsPerPreset[index - 1]) }}</span>
          </div>
        </div>
        <span class="text-[10px] text-gray-500 italic hidden sm:block">{{ missionPlannerStore.CAMPAIGN_ORDER_PRESETS[missionPlannerStore.campaignOrderPreset]?.description }}</span>
      </div>

      <!-- Total Time + Fragments -->
      <div class="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-700/50">
        <!-- Total Completion Time -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 font-semibold">All Campaigns Time:</span>
          <span class="text-purple-400 font-bold text-sm">{{ totalCompletionTimeFormatted }}</span>
        </div>

        <!-- Total Fragments (right-aligned) -->
        <div class="flex items-center gap-1.5 ml-auto">
          <span class="text-xs text-gray-400 font-semibold">Fragments:</span>
          <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
          <span class="text-amber-400 font-bold text-sm">{{ formatFrags(totalFragments) }}</span>
        </div>
      </div>
    </div>

    <!-- Campaigns Table -->
    <div class="overflow-x-auto overflow-y-auto max-h-[496px]">
      <table class="text-xs table-fixed w-full rounded-lg overflow-hidden">
        <thead class="bg-gray-700 text-gray-300 sticky top-0 z-10">
          <tr>
            <th class="px-2 py-1.5 text-center w-[4%] rounded-tl-lg">#</th>
            <th class="px-2 py-1.5 text-left w-[9%]">Campaign</th>
            <th class="px-2 py-1.5 text-right w-[7%]">Max Crew</th>
            <th class="px-2 py-1.5 text-right w-[7%]">Assigned</th>
            <th class="px-2 py-1.5 text-right w-[12%]">Time</th>
            <th class="px-2 py-1.5 text-right w-[11%]">
              <div class="flex items-center justify-end gap-1">
                <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
                <span>Base</span>
              </div>
            </th>
            <th class="px-2 py-1.5 text-right w-[11%]">
              <div class="flex items-center justify-end gap-1">
                <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
                <span>Bonus</span>
              </div>
            </th>
            <th class="px-2 py-1.5 text-right w-[11%]">
              <div class="flex items-center justify-end gap-1">
                <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
                <span>Combined</span>
              </div>
            </th>
            <th class="px-2 py-1.5 text-right w-[11%] rounded-tr-lg">
              <div class="flex items-center justify-end gap-1">
                <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
                <span>Cumulative</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(campaign, index) in campaignsWithStats"
            :key="campaign.tag"
            :class="index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'"
          >
            <td class="px-2 py-1.5 text-center text-gray-500">{{ index + 1 }}</td>
            <td class="px-2 py-1.5 font-mono text-white">{{ campaign.tag }}</td>
            <td class="px-2 py-1.5 text-right text-gray-400">{{ formatCrew(campaign.adjustedMaxCrew) }}</td>
            <td
              class="px-2 py-1.5 text-right"
              :class="campaign.crewUsed >= campaign.adjustedMaxCrew ? 'text-green-400' : campaign.crewUsed > 0 ? 'text-yellow-400' : 'text-red-400'"
            >
              {{ formatCrew(campaign.crewUsed) }}
            </td>
            <td class="px-2 py-1.5 text-right font-mono font-semibold text-white">
              {{ campaign.completionTimeFormatted }}
            </td>
            <td class="px-2 py-1.5 text-right text-gray-300 font-mono">{{ formatFrags(campaign.baseFrags) }}</td>
            <td
              class="px-2 py-1.5 text-right font-mono"
              :class="campaign.bonusFrags > 0 ? 'text-green-400 font-semibold' : 'text-gray-600'"
            >
              {{ campaign.bonusFrags > 0 ? `+${formatFrags(campaign.bonusFrags)}` : '—' }}
            </td>
            <td class="px-2 py-1.5 text-right text-amber-400 font-mono">{{ formatFrags(campaign.combinedFrags) }}</td>
            <td class="px-2 py-1.5 text-right text-amber-300 font-mono font-semibold">{{ formatFrags(campaign.cumulativeFrags) }}</td>
          </tr>
        </tbody>
        <!-- Footer with Totals -->
        <tfoot class="bg-gray-700 border-t border-gray-600 sticky bottom-0">
          <tr>
            <td colspan="4" class="px-2 py-2 text-right font-semibold text-gray-300">Total All Campaigns:</td>
            <td class="px-2 py-2 text-right text-purple-400 font-bold font-mono">{{ totalCompletionTimeFormatted }}</td>
            <td class="px-2 py-2 text-right text-gray-500">—</td>
            <td class="px-2 py-2 text-right text-gray-500">—</td>
            <td class="px-2 py-2 text-right font-bold font-mono" colspan="2">
              <div class="flex items-center justify-end gap-1">
                <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
                <span class="text-amber-400">{{ formatFrags(totalFragments) }}</span>
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
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { CAMPAIGN_MISSIONS } from '../constants/missions';
import { formatNumber } from '@/composables/format';

const missionPlannerStore = useMissionPlannerStore();

// Format crew values - no decimals under 1000
function formatCrew(value) {
  if (value < 1000) {
    return Math.floor(value).toString();
  }
  return formatNumber(value, 0);
}

// Get remaining personnel based on campaign fill order position
const remainingPersonnel = computed(() => {
  const fillOrderPos = missionPlannerStore.campaignFillOrder;
  return missionPlannerStore.getPersonnelAtFillOrderPosition(fillOrderPos);
});

// Calculate stats for each campaign in preset order.
// Uses graduated Ultima-adjusted mission speed based on campaign milestones:
//   before C1-8 → 0 ultima, C1-8→C2-8 → max 5, C2-8→C3-12 → ultima-2, C3-12+ → full ultima
const campaignsWithStats = computed(() => {
  const powerPerTier = missionPlannerStore.powerPerTier;
  const normalMissionSpeed = missionPlannerStore.missionSpeedMultiplier;
  const speedUltima0  = missionPlannerStore.missionSpeedUltima0;
  const speedUltima5  = missionPlannerStore.missionSpeedUltima5;
  const speedUltimaMinus2 = missionPlannerStore.missionSpeedMultiplierUltimaAdjusted;
  const r11Multiplier = missionPlannerStore.relicEffectsBreakdown?.campaignMaxCrewMultiplier || 1;

  const OPTIMAL_ORDER = missionPlannerStore.OPTIMAL_CAMPAIGN_ORDER;
  const FINAL_MULTIPLIERS = missionPlannerStore.CAMPAIGN_FINAL_MULTIPLIERS;

  const c18Index  = OPTIMAL_ORDER.indexOf('C1-8');
  const c28Index  = OPTIMAL_ORDER.indexOf('C2-8');
  const c312Index = OPTIMAL_ORDER.indexOf('C3-12');

  const available = { ...remainingPersonnel.value };
  let cumulativeFrags = 0;

  const result = OPTIMAL_ORDER.map((tag, orderIndex) => {
    const campaign = CAMPAIGN_MISSIONS.find(c => c.tag === tag);
    if (!campaign) return null;

    const adjustedMaxCrew = Math.floor(campaign.maxCrew * r11Multiplier);

    let crewUsed = 0;
    let totalPower = 0;
    const usedPersonnel = { T1: 0, T2: 0, T3: 0, T4: 0 };

    // Fill with available personnel - personnel is REUSED for each campaign
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

    // Graduated ultima speed based on milestone thresholds
    let missionSpeed;
    if (c312Index >= 0 && orderIndex >= c312Index) {
      missionSpeed = normalMissionSpeed;
    } else if (c28Index >= 0 && orderIndex >= c28Index) {
      missionSpeed = speedUltimaMinus2;
    } else if (c18Index >= 0 && orderIndex >= c18Index) {
      missionSpeed = speedUltima5;
    } else {
      missionSpeed = speedUltima0;
    }

    let completionTimeMinutes = campaign.timeInMinutes;
    if (totalPower > 0 && missionSpeed > 0) {
      completionTimeMinutes = campaign.timeInMinutes / (totalPower * missionSpeed);
    }

    const finalMultiplier = FINAL_MULTIPLIERS[tag] || 1;
    const baseFrags = missionPlannerStore.calculateCampaignFragsForIndex(orderIndex);
    const combinedFrags = baseFrags * finalMultiplier;
    const bonusFrags = combinedFrags - baseFrags;
    cumulativeFrags += combinedFrags;

    return {
      ...campaign,
      adjustedMaxCrew,
      crewUsed,
      totalPower,
      usedPersonnel,
      completionTimeMinutes,
      completionTimeFormatted: formatTime(completionTimeMinutes),
      baseFrags,
      finalMultiplier,
      bonusFrags,
      combinedFrags,
      cumulativeFrags,
      orderIndex,
    };
  }).filter(Boolean);

  return result;
});

const totalCompletionTime = computed(() => {
  const hasNoCrew = campaignsWithStats.value.some(c => c.totalPower === 0);
  if (hasNoCrew) return Infinity;
  return campaignsWithStats.value.reduce((total, c) => total + c.completionTimeMinutes, 0);
});

const totalCompletionTimeFormatted = computed(() => formatTime(totalCompletionTime.value));

const totalBaseFrags = computed(() =>
  campaignsWithStats.value.reduce((total, c) => total + c.baseFrags, 0)
);

const totalFragments = computed(() =>
  campaignsWithStats.value.reduce((total, c) => total + c.combinedFrags, 0)
);

// Total combined frags for each preset (without changing active preset)
const fragsPerPreset = computed(() => {
  const FINAL_MULTIPLIERS = missionPlannerStore.CAMPAIGN_FINAL_MULTIPLIERS;
  return missionPlannerStore.CAMPAIGN_ORDER_PRESETS.map((preset) => {
    let total = 0;
    preset.order.forEach((tag, orderIndex) => {
      const baseFrags = missionPlannerStore.calculateCampaignFragsForIndex(orderIndex);
      const finalMultiplier = FINAL_MULTIPLIERS[tag] || 1;
      total += baseFrags * finalMultiplier;
    });
    return total;
  });
});

// Format fragment values: 3 decimal places when the displayed (scaled) value is under 10
function formatFrags(value) {
  if (!value || value === 0) return '0';
  const absValue = Math.abs(value);
  // Determine the scaled value (same tier logic as formatNumber)
  const tier = absValue >= 1 ? Math.max(0, Math.min(Math.floor(Math.log10(absValue) / 3), 11)) : 0;
  const scaled = tier > 0 ? absValue / Math.pow(10, tier * 3) : absValue;
  return formatNumber(value, scaled < 10 ? 3 : 2);
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

  const hours = minutes / 60;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function updateCampaignFillOrder(value) {
  const newValue = parseInt(value, 10);
  missionPlannerStore.setCampaignFillOrder(newValue);
}
</script>
