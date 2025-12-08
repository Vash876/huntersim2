<template>
  <div class="bg-gray-800/50 rounded-b-lg border border-gray-700/50 border-t-0 overflow-hidden">
    <!-- Mission Cards -->
    <div class="p-2 space-y-2">
      <template v-for="(missions, planetIndex) in farmMissionsByPlanet" :key="planetIndex">
        <!-- Planet Header -->
        <div class="bg-blue-900/30 rounded-lg px-3 py-1.5 flex items-center gap-2 border-l-2 border-blue-500">
          <IconPlanet size="14" class="text-blue-400" />
          <span class="text-sm font-semibold text-blue-400">{{ missions[0]?.planet || 'Unknown' }}</span>
        </div>
        
        <!-- Mission Cards for this Planet -->
        <div class="space-y-2">
          <div 
            v-for="mission in missions" 
            :key="mission.tag"
            class="bg-gray-700/40 rounded-lg p-3 border-l-2"
            :class="missionPlannerStore.isManualMode(mission.tag) ? 'border-l-yellow-500' : 'border-l-transparent'"
          >
            <!-- Card Header: Mission Tag + Controls -->
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-white text-sm">{{ mission.tag }}</span>
                <span class="text-[10px] text-gray-500 bg-gray-600/50 px-1.5 py-0.5 rounded">
                  Max: {{ formatNumber(mission.maxCrew) }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <!-- Fill Order -->
                <select
                  :value="missionPlannerStore.getFillOrder(mission.tag)"
                  @change="updateFillOrder(mission.tag, $event.target.value)"
                  class="w-12 px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-white text-xs text-center focus:border-blue-500 outline-none"
                >
                  <option v-for="n in 17" :key="n" :value="n">#{{ n }}</option>
                </select>
                <!-- Manual Mode Toggle -->
                <button
                  @click="toggleManualMode(mission.tag)"
                  class="w-7 h-7 rounded flex items-center justify-center"
                  :class="missionPlannerStore.isManualMode(mission.tag) 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-600 text-gray-400'"
                >
                  <IconLock v-if="missionPlannerStore.isManualMode(mission.tag)" size="14" />
                  <IconLockOpen v-else size="14" />
                </button>
              </div>
            </div>
            
            <!-- Personnel Grid (2x2) -->
            <div class="grid grid-cols-4 gap-1.5 mb-2">
              <div class="bg-gray-800/50 rounded p-1.5 text-center">
                <div class="text-[10px] text-red-400 font-semibold mb-0.5">T1</div>
                <input
                  :value="getAssignment(mission.tag).T1"
                  @input="updateAssignment(mission.tag, 'T1', $event.target.value)"
                  type="number"
                  min="0"
                  :disabled="!missionPlannerStore.isManualMode(mission.tag)"
                  class="w-full px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-xs text-center text-white outline-none disabled:opacity-50"
                />
              </div>
              <div class="bg-gray-800/50 rounded p-1.5 text-center">
                <div class="text-[10px] text-orange-400 font-semibold mb-0.5">T2</div>
                <input
                  :value="getAssignment(mission.tag).T2"
                  @input="updateAssignment(mission.tag, 'T2', $event.target.value)"
                  type="number"
                  min="0"
                  :disabled="!missionPlannerStore.isManualMode(mission.tag)"
                  class="w-full px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-xs text-center text-white outline-none disabled:opacity-50"
                />
              </div>
              <div class="bg-gray-800/50 rounded p-1.5 text-center">
                <div class="text-[10px] text-yellow-400 font-semibold mb-0.5">T3</div>
                <input
                  :value="getAssignment(mission.tag).T3"
                  @input="updateAssignment(mission.tag, 'T3', $event.target.value)"
                  type="number"
                  min="0"
                  :disabled="!missionPlannerStore.isManualMode(mission.tag)"
                  class="w-full px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-xs text-center text-white outline-none disabled:opacity-50"
                />
              </div>
              <div class="bg-gray-800/50 rounded p-1.5 text-center">
                <div class="text-[10px] text-green-400 font-semibold mb-0.5">T4</div>
                <input
                  :value="getAssignment(mission.tag).T4"
                  @input="updateAssignment(mission.tag, 'T4', $event.target.value)"
                  type="number"
                  min="0"
                  :disabled="!missionPlannerStore.isManualMode(mission.tag)"
                  class="w-full px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-xs text-center text-white outline-none disabled:opacity-50"
                />
              </div>
            </div>
            
            <!-- Stats Row -->
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-3">
                <!-- Time -->
                <div class="flex items-center gap-1">
                  <span class="text-gray-500">Time:</span>
                  <span 
                    class="font-mono"
                    :class="getMissionStats(mission.tag).isAtCap ? 'text-green-400' : 'text-gray-300'"
                  >
                    {{ getMissionStats(mission.tag).completionTimeFormatted }}
                  </span>
                </div>
                <!-- Left -->
                <div class="flex items-center gap-1">
                  <span class="text-gray-500">Left:</span>
                  <span 
                    class="font-mono"
                    :class="getLeftCrew(mission.tag, mission.maxCrew) > 0 ? 'text-yellow-400' : 'text-gray-500'"
                  >
                    {{ getLeftCrew(mission.tag, mission.maxCrew) }}
                  </span>
                </div>
              </div>
              <!-- Frags -->
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3 h-3" />
                  <span class="font-mono font-semibold" :style="{ color: getIncomeColor(mission.tag) }">
                    {{ formatNumberWithCommas(getMissionStats(mission.tag).fragsPerHour, 0) }}/hr
                  </span>
                </div>
                <span class="text-gray-500 text-[10px]">{{ getIncomePercentage(mission.tag) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <!-- Campaign Card -->
      <div class="bg-amber-900/20 rounded-lg px-3 py-1.5 flex items-center gap-2 border-l-2 border-amber-500">
        <IconFlag size="14" class="text-amber-400" />
        <span class="text-sm font-semibold text-amber-400">Campaign</span>
      </div>
      
      <div 
        class="bg-gray-700/40 rounded-lg p-3 border-l-2"
        :class="missionPlannerStore.isCampaignManualMode() ? 'border-l-yellow-500' : 'border-l-transparent'"
      >
        <!-- Card Header -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span 
              @click="$emit('openCampaignModal')"
              class="font-mono font-bold text-sm cursor-pointer"
              :class="selectedCampaign ? 'text-white' : 'text-gray-500'"
            >
              {{ selectedCampaign || 'Select...' }}
            </span>
            <span v-if="selectedCampaignData" class="text-[10px] text-gray-500 bg-gray-600/50 px-1.5 py-0.5 rounded">
              Max: {{ formatNumber(selectedCampaignData.maxCrew) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <select
              :value="missionPlannerStore.campaignFillOrder"
              @change="missionPlannerStore.setCampaignFillOrder(Number($event.target.value))"
              class="w-12 px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-white text-xs text-center focus:border-purple-500 outline-none"
            >
              <option v-for="n in 17" :key="n" :value="n">#{{ n }}</option>
            </select>
            <button
              @click="missionPlannerStore.toggleCampaignManualMode()"
              class="w-7 h-7 rounded flex items-center justify-center"
              :class="missionPlannerStore.isCampaignManualMode() 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-600 text-gray-400'"
            >
              <IconLock v-if="missionPlannerStore.isCampaignManualMode()" size="14" />
              <IconLockOpen v-else size="14" />
            </button>
          </div>
        </div>
        
        <!-- Personnel Grid -->
        <div class="grid grid-cols-4 gap-1.5 mb-2">
          <div class="bg-gray-800/50 rounded p-1.5 text-center">
            <div class="text-[10px] text-red-400 font-semibold mb-0.5">T1</div>
            <input
              :value="getCampaignAssignment().T1"
              @input="updateCampaignAssignment('T1', $event.target.value)"
              type="number"
              min="0"
              :disabled="!selectedCampaign || !missionPlannerStore.isCampaignManualMode()"
              class="w-full px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-xs text-center text-white outline-none disabled:opacity-50"
            />
          </div>
          <div class="bg-gray-800/50 rounded p-1.5 text-center">
            <div class="text-[10px] text-orange-400 font-semibold mb-0.5">T2</div>
            <input
              :value="getCampaignAssignment().T2"
              @input="updateCampaignAssignment('T2', $event.target.value)"
              type="number"
              min="0"
              :disabled="!selectedCampaign || !missionPlannerStore.isCampaignManualMode()"
              class="w-full px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-xs text-center text-white outline-none disabled:opacity-50"
            />
          </div>
          <div class="bg-gray-800/50 rounded p-1.5 text-center">
            <div class="text-[10px] text-yellow-400 font-semibold mb-0.5">T3</div>
            <input
              :value="getCampaignAssignment().T3"
              @input="updateCampaignAssignment('T3', $event.target.value)"
              type="number"
              min="0"
              :disabled="!selectedCampaign || !missionPlannerStore.isCampaignManualMode()"
              class="w-full px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-xs text-center text-white outline-none disabled:opacity-50"
            />
          </div>
          <div class="bg-gray-800/50 rounded p-1.5 text-center">
            <div class="text-[10px] text-green-400 font-semibold mb-0.5">T4</div>
            <input
              :value="getCampaignAssignment().T4"
              @input="updateCampaignAssignment('T4', $event.target.value)"
              type="number"
              min="0"
              :disabled="!selectedCampaign || !missionPlannerStore.isCampaignManualMode()"
              class="w-full px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-xs text-center text-white outline-none disabled:opacity-50"
            />
          </div>
        </div>
        
        <!-- Stats Row -->
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1">
            <span class="text-gray-500">Time:</span>
            <span class="font-mono text-purple-400">{{ campaignTime }}</span>
          </div>
          <div class="flex items-center gap-1">
            <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3 h-3" />
            <span class="font-mono font-semibold text-purple-400">{{ campaignFrags }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconPlanet, IconFlag, IconLock, IconLockOpen } from '@tabler/icons-vue';
import { FARM_MISSIONS, CAMPAIGN_MISSIONS } from '@/views/tools/mission-planner/constants/missions';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { formatNumber } from '@/composables/format';

const emit = defineEmits(['openCampaignModal']);

const missionPlannerStore = useMissionPlannerStore();

// Group farm missions by planet
const farmMissionsByPlanet = computed(() => {
  const grouped = {};
  FARM_MISSIONS.forEach(mission => {
    if (!grouped[mission.planet]) {
      grouped[mission.planet] = [];
    }
    grouped[mission.planet].push(mission);
  });
  return Object.values(grouped);
});

// Selected campaign
const selectedCampaign = computed(() => missionPlannerStore.selectedCampaign);
const selectedCampaignData = computed(() => missionPlannerStore.getSelectedCampaignData());

// Campaign time and frags
const campaignTime = computed(() => {
  const result = missionPlannerStore.getSelectedCampaignEstimatedTime();
  return result ? result.formatted : '-';
});

const campaignFrags = computed(() => {
  if (!selectedCampaign.value) return '-';
  const campaign = selectedCampaignData.value;
  if (!campaign) return '-';
  const stats = missionPlannerStore.getMissionStats(campaign, getCampaignAssignment());
  return formatNumberWithCommas(stats.fragsPerCompletion || 0, 0);
});

// Get assignment for a mission
function getAssignment(missionTag) {
  return missionPlannerStore.getAssignment(missionTag);
}

// Get campaign assignment
function getCampaignAssignment() {
  if (!selectedCampaign.value) return { T1: 0, T2: 0, T3: 0, T4: 0 };
  return missionPlannerStore.getAssignment(selectedCampaign.value);
}

// Update assignment
function updateAssignment(missionTag, tier, value) {
  const current = missionPlannerStore.getAssignment(missionTag);
  const newValue = parseInt(value) || 0;
  missionPlannerStore.setAssignment(missionTag, {
    ...current,
    [tier]: newValue
  });
}

// Update campaign assignment
function updateCampaignAssignment(tier, value) {
  if (!selectedCampaign.value) return;
  const current = getCampaignAssignment();
  const newValue = parseInt(value) || 0;
  missionPlannerStore.setAssignment(selectedCampaign.value, {
    ...current,
    [tier]: newValue
  });
}

// Get remaining crew slots
function getLeftCrew(missionTag, maxCrew) {
  const assignment = missionPlannerStore.getAssignment(missionTag);
  const usedCrew = (assignment.T1 || 0) + (assignment.T2 || 0) + (assignment.T3 || 0) + (assignment.T4 || 0);
  return maxCrew - usedCrew;
}

// Toggle manual mode
function toggleManualMode(missionTag) {
  missionPlannerStore.toggleManualMode(missionTag);
}

// Update fill order
function updateFillOrder(missionTag, value) {
  const newOrder = parseInt(value) || 1;
  missionPlannerStore.setFillOrder(missionTag, newOrder);
}

// Get mission stats
function getMissionStats(missionTag) {
  const mission = FARM_MISSIONS.find(m => m.tag === missionTag);
  if (!mission) return { completionTimeFormatted: '∞', fragsPerHour: 0, isAtCap: false };
  const personnel = missionPlannerStore.getAssignment(missionTag);
  return missionPlannerStore.getMissionStats(mission, personnel);
}

// Income color calculation
const farmIncomeStats = computed(() => {
  const stats = {};
  let maxIncome = 0;
  let minIncome = Infinity;
  
  FARM_MISSIONS.forEach(mission => {
    const missionStats = getMissionStats(mission.tag);
    const fragsPerDay = (missionStats.fragsPerHour || 0) * 24;
    stats[mission.tag] = fragsPerDay;
    
    if (fragsPerDay > 0) {
      if (fragsPerDay > maxIncome) maxIncome = fragsPerDay;
      if (fragsPerDay < minIncome) minIncome = fragsPerDay;
    }
  });
  
  if (minIncome === Infinity) minIncome = 0;
  return { stats, maxIncome, minIncome };
});

function getIncomeColor(missionTag) {
  const { stats, maxIncome, minIncome } = farmIncomeStats.value;
  const income = stats[missionTag] || 0;
  
  if (income === 0 || maxIncome === 0) return '#6b7280';
  
  const logMin = minIncome > 0 ? Math.log(minIncome) : 0;
  const logMax = Math.log(maxIncome);
  const logIncome = Math.log(income);
  
  const logRange = logMax - logMin;
  let percentage = logRange > 0 ? (logIncome - logMin) / logRange : 1;
  percentage = Math.pow(percentage, 1.2);
  
  if (percentage <= 0.5) {
    const t = percentage * 2;
    const r = 239;
    const g = Math.round(68 + (179 - 68) * t);
    const b = Math.round(68 - 60 * t);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const t = (percentage - 0.5) * 2;
    const r = Math.round(234 - (234 - 34) * t);
    const g = Math.round(179 + (197 - 179) * t);
    const b = Math.round(8 + (94 - 8) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

function getIncomePercentage(missionTag) {
  const { stats } = farmIncomeStats.value;
  const income = stats[missionTag] || 0;
  const totalIncome = Object.values(stats).reduce((a, b) => a + b, 0);
  
  if (totalIncome === 0 || income === 0) return '0%';
  return ((income / totalIncome) * 100).toFixed(1) + '%';
}

function formatNumberWithCommas(num, decimals = 0) {
  if (num === undefined || num === null) return '0';
  if (!isFinite(num)) return '∞';
  
  let value;
  if (decimals > 0) {
    value = num.toFixed(decimals);
  } else {
    value = (num >= 1000 ? Math.round(num) : Math.floor(num)).toString();
  }
  
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
