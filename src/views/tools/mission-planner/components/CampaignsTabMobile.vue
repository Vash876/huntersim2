<template>
  <div class="flex flex-col gap-2">
    <!-- Summary Bar -->
    <div class="bg-gray-900/50 rounded-lg p-2.5 border border-gray-700/50">
      <!-- Fill Order -->
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-gray-400 font-semibold">Campaign Fill Order:</span>
        <select
          :value="missionPlannerStore.campaignFillOrder"
          @change="updateCampaignFillOrder($event.target.value)"
          class="w-12 px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-white text-[10px] text-center focus:border-purple-500 outline-none cursor-pointer"
        >
          <option v-for="n in 17" :key="n" :value="n">{{ n }}</option>
        </select>
        <span class="text-[9px] text-gray-500">(after {{ missionPlannerStore.campaignFillOrder - 1 }} farm missions)</span>
      </div>

      <!-- Run Order Presets -->
      <div class="flex flex-wrap items-start gap-2 mt-2 pt-2 border-t border-gray-700/50">
        <span class="text-[10px] text-gray-400 font-semibold whitespace-nowrap mt-0.5">Run Order:</span>
        <div class="flex flex-wrap gap-1.5 items-start">
          <div
            v-for="(preset, index) in missionPlannerStore.CAMPAIGN_ORDER_PRESETS"
            :key="index"
            class="flex flex-col items-center gap-0.5"
          >
            <button
              @click="missionPlannerStore.setCampaignOrderPreset(index)"
              :title="preset.description"
              class="px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all duration-150"
              :class="missionPlannerStore.campaignOrderPreset === index
                ? 'bg-purple-600 text-white ring-1 ring-purple-400'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
            >
              {{ preset.label }}
            </button>
            <span
              v-if="index === 0 && fragsPerPreset[0] != null"
              class="text-[9px] text-amber-400 font-semibold whitespace-nowrap"
            >{{ formatFrags(fragsPerPreset[0]) }}</span>
            <span
              v-else-if="index > 0 && fragsPerPreset[index] != null && fragsPerPreset[index - 1] != null"
              class="text-[9px] text-green-400 font-semibold whitespace-nowrap"
            >+{{ formatFrags(fragsPerPreset[index] - fragsPerPreset[index - 1]) }}</span>
          </div>
        </div>
      </div>

      <!-- Total Time + Fragments -->
      <div class="flex items-center gap-3 mt-2 pt-2 border-t border-gray-700/50">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-gray-400 font-semibold">Time:</span>
          <span class="text-purple-400 font-bold text-xs">{{ totalCompletionTimeFormatted }}</span>
        </div>
        <div class="flex items-center gap-1 ml-auto">
          <span class="text-[10px] text-gray-400 font-semibold">Frags:</span>
          <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3 h-3" />
          <span class="text-amber-400 font-bold text-xs">{{ formatFrags(totalFragments) }}</span>
        </div>
      </div>
    </div>

    <!-- Campaign List -->
    <div class="overflow-x-auto">
    <div class="overflow-y-auto max-h-[450px] flex flex-col gap-0.5 min-w-[560px]">
      <!-- Header -->
      <div class="flex items-center gap-2 px-2 py-1 bg-gray-700 rounded sticky top-0 z-10">
        <span class="text-[10px] text-gray-400 font-semibold w-4 text-center shrink-0">#</span>
        <span class="text-[10px] text-gray-400 font-semibold w-12 shrink-0">Camp</span>
        <span class="text-[10px] text-gray-400 font-semibold w-16 shrink-0">Crew</span>
        <span class="text-[10px] text-gray-400 font-semibold w-16 shrink-0">Time</span>
        <div class="flex-1" />
        <span class="text-[10px] text-gray-400 font-semibold w-14 text-right shrink-0">Base</span>
        <span class="text-[10px] text-gray-400 font-semibold w-14 text-right shrink-0">Bonus</span>
        <span class="text-[10px] text-gray-400 font-semibold w-14 text-right shrink-0">Combined</span>
        <span class="text-[10px] text-gray-400 font-semibold w-14 text-right shrink-0">Cumul.</span>
      </div>
      <div
        v-for="(campaign, index) in campaignsWithStats"
        :key="campaign.tag"
        class="rounded px-2 py-1.5 border border-gray-700/30"
        :class="index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'"
      >
        <div class="flex items-center gap-2">
          <!-- # -->
          <span class="text-[10px] text-gray-500 w-4 text-center shrink-0">{{ index + 1 }}</span>

          <!-- Tag -->
          <span class="text-white font-mono font-semibold text-xs w-12 shrink-0">{{ campaign.tag }}</span>

          <!-- Crew -->
          <span
            class="text-[10px] font-mono w-16 shrink-0"
            :class="campaign.crewUsed >= campaign.adjustedMaxCrew ? 'text-green-400' : campaign.crewUsed > 0 ? 'text-yellow-400' : 'text-red-400'"
          >{{ formatCrew(campaign.crewUsed) }}/{{ formatCrew(campaign.adjustedMaxCrew) }}</span>

          <!-- Time -->
          <span class="text-[10px] text-white font-mono w-16 shrink-0">{{ campaign.completionTimeFormatted }}</span>

          <div class="flex-1" />

          <!-- Base -->
          <span class="text-[10px] text-gray-300 font-mono shrink-0 w-14 text-right">{{ formatFrags(campaign.baseFrags) }}</span>

          <!-- Bonus -->
          <span
            class="text-[10px] font-mono shrink-0 w-14 text-right"
            :class="campaign.bonusFrags > 0 ? 'text-green-400 font-semibold' : 'text-gray-600'"
          >{{ campaign.bonusFrags > 0 ? `+${formatFrags(campaign.bonusFrags)}` : '—' }}</span>

          <!-- Combined -->
          <span class="text-[10px] text-amber-400 font-mono shrink-0 w-14 text-right">{{ formatFrags(campaign.combinedFrags) }}</span>

          <!-- Cumulative -->
          <span class="text-[10px] text-amber-300 font-mono font-semibold shrink-0 w-14 text-right">{{ formatFrags(campaign.cumulativeFrags) }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center gap-2 px-2 py-1.5 bg-gray-700 rounded border border-gray-600 mt-0.5">
        <span class="text-[10px] text-gray-300 font-semibold">Total:</span>
        <span class="text-purple-400 font-bold font-mono text-[10px]">{{ totalCompletionTimeFormatted }}</span>
        <div class="flex-1" />
        <div class="flex items-center gap-1">
          <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3 h-3" />
          <span class="text-amber-400 font-bold font-mono text-[10px]">{{ formatFrags(totalFragments) }}</span>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { CAMPAIGN_MISSIONS } from '../constants/missions';
import { formatNumber } from '@/composables/format';

const missionPlannerStore = useMissionPlannerStore();

function formatCrew(value) {
  if (value < 1000) return Math.floor(value).toString();
  return formatNumber(value, 0);
}

const remainingPersonnel = computed(() => {
  const fillOrderPos = missionPlannerStore.campaignFillOrder;
  return missionPlannerStore.getPersonnelAtFillOrderPosition(fillOrderPos);
});

const campaignsWithStats = computed(() => {
  const powerPerTier = missionPlannerStore.powerPerTier;
  const normalMissionSpeed = missionPlannerStore.missionSpeedMultiplier;
  const speedUltima0      = missionPlannerStore.missionSpeedUltima0;
  const speedUltima5      = missionPlannerStore.missionSpeedUltima5;
  const speedUltimaMinus2 = missionPlannerStore.missionSpeedMultiplierUltimaAdjusted;
  const r11Multiplier = missionPlannerStore.relicEffectsBreakdown?.campaignMaxCrewMultiplier || 1;

  const OPTIMAL_ORDER = missionPlannerStore.OPTIMAL_CAMPAIGN_ORDER;
  const FINAL_MULTIPLIERS = missionPlannerStore.CAMPAIGN_FINAL_MULTIPLIERS;

  const c18Index  = OPTIMAL_ORDER.indexOf('C1-8');
  const c28Index  = OPTIMAL_ORDER.indexOf('C2-8');
  const c312Index = OPTIMAL_ORDER.indexOf('C3-12');

  const available = { ...remainingPersonnel.value };
  let cumulativeFrags = 0;

  return OPTIMAL_ORDER.map((tag, orderIndex) => {
    const campaign = CAMPAIGN_MISSIONS.find(c => c.tag === tag);
    if (!campaign) return null;

    const adjustedMaxCrew = Math.floor(campaign.maxCrew * r11Multiplier);

    let crewUsed = 0;
    let totalPower = 0;

    for (const tier of ['T1', 'T2', 'T3', 'T4']) {
      const availableOfTier = available[tier] || 0;
      const spaceLeft = adjustedMaxCrew - crewUsed;
      const toAssign = Math.min(availableOfTier, spaceLeft);

      if (toAssign > 0) {
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
});

const totalCompletionTime = computed(() => {
  const hasNoCrew = campaignsWithStats.value.some(c => c.totalPower === 0);
  if (hasNoCrew) return Infinity;
  return campaignsWithStats.value.reduce((total, c) => total + c.completionTimeMinutes, 0);
});

const totalCompletionTimeFormatted = computed(() => formatTime(totalCompletionTime.value));

const totalFragments = computed(() =>
  campaignsWithStats.value.reduce((total, c) => total + c.combinedFrags, 0)
);

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

function formatFrags(value) {
  if (!value || value === 0) return '0';
  const absValue = Math.abs(value);
  const tier = absValue >= 1 ? Math.max(0, Math.min(Math.floor(Math.log10(absValue) / 3), 11)) : 0;
  const scaled = tier > 0 ? absValue / Math.pow(10, tier * 3) : absValue;
  return formatNumber(value, scaled < 10 ? 3 : 2);
}

function formatTime(minutes) {
  if (!isFinite(minutes)) return '∞';
  if (!minutes || minutes <= 0) return '-';

  const totalSeconds = minutes * 60;

  if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`;

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
  missionPlannerStore.setCampaignFillOrder(parseInt(value, 10));
}
</script>
