<template>
  <div class="container mx-auto px-2 py-4">
    <!-- Top Section mit Header und Aktionsleiste -->
    <div class="mb-3 rounded-lg overflow-hidden shadow-lg border border-gray-700/50">
      <!-- Header mit blauem Farb-Gradient -->
      <div class="bg-gradient-to-r from-blue-900 to-gray-800 p-3 border-b border-gray-600 rounded-t-lg">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div class="flex items-center">
              <IconSword size="20" class="mr-2 text-blue-400" />
              <h1 class="text-xl font-bold">Mission Planner</h1>
            </div>
          </div>
        </div>
      </div>

      <!-- Personnel Summary Bar -->
      <div class="bg-gray-800/90 px-3 py-2 border-b border-gray-700/50">
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
          <!-- Personnel Available -->
          <div class="flex items-center gap-3">
            <span class="text-gray-400 font-semibold">Available:</span>
            <div class="flex gap-2">
              <span class="text-red-400">T1: {{ formatNumber(availablePersonnel.T1) }}</span>
              <span class="text-orange-400">T2: {{ formatNumber(availablePersonnel.T2) }}</span>
              <span class="text-yellow-400">T3: {{ formatNumber(availablePersonnel.T3) }}</span>
              <span class="text-green-400">T4: {{ formatNumber(availablePersonnel.T4) }}</span>
            </div>
          </div>
          
          <!-- Personnel Used -->
          <div class="flex items-center gap-3">
            <span class="text-gray-400 font-semibold">Used:</span>
            <div class="flex gap-2">
              <span class="text-red-400">{{ formatNumber(personnelUsed.T1) }}</span>
              <span class="text-orange-400">{{ formatNumber(personnelUsed.T2) }}</span>
              <span class="text-yellow-400">{{ formatNumber(personnelUsed.T3) }}</span>
              <span class="text-green-400">{{ formatNumber(personnelUsed.T4) }}</span>
            </div>
          </div>
          
          <!-- Total Frags/Hour & Day -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
              <img src="@/assets/general/fragments.png" alt="Fragments" class="w-4 h-4" />
              <span class="text-gray-400 font-semibold">Frags/hr:</span>
              <span class="text-cyan-400 font-bold">{{ formatNumberWithCommas(totalFragsPerHour, 2) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <img src="@/assets/general/fragments.png" alt="Fragments" class="w-4 h-4" />
              <span class="text-gray-400 font-semibold">Frags/day:</span>
              <span class="text-emerald-400 font-bold">{{ formatNumberWithCommas(totalFragsPerHour * 24, 2) }}</span>
            </div>
            <div class="flex items-center gap-1 border-l border-gray-600 pl-4">
              <img src="@/assets/general/fragments.png" alt="Fragments" class="w-4 h-4" />
              <span class="text-gray-400 font-semibold">All Campaigns:</span>
              <span class="text-purple-400 font-bold">{{ missionPlannerStore.totalCampaignFragments.formatted }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2-Column Layout: Modifiers Panel (Left) + Missions (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <!-- Left: Modifiers Panel -->
      <div class="lg:max-h-[calc(100vh-200px)] lg:sticky lg:top-4">
        <ModifiersPanel />
      </div>

      <!-- Right: Mission Tables -->
      <div>
        <!-- Tab Navigation -->
        <div class="bg-gray-800/80 rounded-t-lg flex items-center justify-between mb-0">
          <div class="flex">
            <button
              @click="activeTab = 'missions'"
              class="px-4 py-2 font-semibold text-xs transition-colors duration-200 border-b-2 rounded-tl-lg"
              :class="activeTab === 'missions' 
                ? 'bg-gray-700/50 text-blue-400 border-blue-500' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
            >
              <div class="flex items-center gap-1.5">
                <IconRefresh size="14" />
                <span>Farms</span>
              </div>
            </button>
            <button
              @click="activeTab = 'campaigns'"
              class="px-4 py-2 font-semibold text-xs transition-colors duration-200 border-b-2"
              :class="activeTab === 'campaigns' 
                ? 'bg-gray-700/50 text-amber-400 border-amber-500' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
            >
              <div class="flex items-center gap-1.5">
                <IconFlag size="14" />
                <span>Campaigns</span>
              </div>
            </button>
            <button
              @click="activeTab = 'relics'"
              class="px-4 py-2 font-semibold text-xs transition-colors duration-200 border-b-2"
              :class="activeTab === 'relics' 
                ? 'bg-gray-700/50 text-purple-400 border-purple-500' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
            >
              <div class="flex items-center gap-1.5">
                <img src="@/assets/general/relics2.png" alt="Relics" class="w-3.5 h-4" />
                <span>Relics</span>
              </div>
            </button>
          </div>
          
          <!-- Clear Button (not shown in Relics tab) -->
          <div v-if="activeTab !== 'relics'" class="flex gap-1.5 pr-2">
            <button
              @click="handleClearAll"
              class="px-2.5 py-1 rounded text-xs font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-colors flex items-center gap-1"
              title="Clear all assignments and reset to auto mode"
            >
              <IconTrash size="14" />
              Clear
            </button>
          </div>
          
          <!-- Reset Targets Button (only shown in Relics tab) -->
          <div v-if="activeTab === 'relics'" class="flex gap-1.5 pr-2">
            <button
              @click="handleResetTargets"
              class="px-2.5 py-1 rounded text-xs font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-colors flex items-center gap-1"
              title="Reset all relic targets to current levels"
            >
              <IconRefresh size="14" />
              Reset Targets
            </button>
          </div>
        </div>

        <!-- Campaigns Tab -->
        <CampaignsTab v-if="activeTab === 'campaigns'" />

        <!-- Missions Tab (Farms + Campaign) -->
        <div v-if="activeTab === 'missions'">
          <!-- Compact Table View -->
          <div class="bg-gray-800/50 rounded-b-lg border border-gray-700/50 border-t-0 overflow-hidden p-3">
            <table class="text-xs table-fixed w-full rounded-lg overflow-hidden">
              <thead class="bg-gray-700/80 text-gray-300">
                <tr>
                  <th class="px-2 py-1.5 text-center rounded-tl-lg w-[6%]" title="Fill Order Priority">#</th>
                  <th class="px-2 py-1.5 text-left w-[7%]">Mission</th>
                  <th class="px-2 py-1.5 text-center w-[7%]">Max</th>
                  <th class="px-2 py-1.5 text-center w-[7%]">Left</th>
                  <th class="px-2 py-1.5 text-center text-red-400 w-[7%]">T1</th>
                  <th class="px-2 py-1.5 text-center text-orange-400 w-[7%]">T2</th>
                  <th class="px-2 py-1.5 text-center text-yellow-400 w-[7%]">T3</th>
                  <th class="px-2 py-1.5 text-center text-green-400 w-[7%]">T4</th>
                  <th class="px-2 py-1.5 text-right w-[10%]">Time</th>
                  <th class="px-2 py-1.5 text-right w-[12%]">Frags/hr</th>
                  <th class="px-2 py-1.5 text-right w-[12%]">Frags/day</th>
                  <th class="px-2 py-1.5 text-right w-[6%]">%</th>
                  <th class="px-2 py-1.5 text-center rounded-tr-lg w-[4%]" title="Manual Mode">M</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(missions, planetIndex) in farmMissionsByPlanet" :key="planetIndex">
                <!-- Planet Header Row -->
                <tr class="bg-gray-700/50">
                  <td colspan="13" class="px-2 py-1 font-semibold text-blue-400">
                    <IconPlanet size="12" class="inline mr-1 -mt-0.5" />
                    {{ missions[0]?.planet || 'Unknown' }}
                  </td>
                </tr>
                <!-- Mission Rows -->
                <tr 
                  v-for="(mission, index) in missions" 
                  :key="mission.tag"
                  :class="[
                    index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50',
                    'border-l-2',
                    missionPlannerStore.isManualMode(mission.tag) ? 'border-l-yellow-500' : 'border-l-transparent'
                  ]"
                >
                  <td class="px-1 py-1">
                    <select
                      :value="missionPlannerStore.getFillOrder(mission.tag)"
                      @change="updateFillOrder(mission.tag, $event.target.value)"
                      class="w-10 px-0.5 py-0.5 bg-gray-900 border border-gray-600 rounded text-white text-xs text-center focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option v-for="n in 17" :key="n" :value="n">{{ n }}</option>
                    </select>
                  </td>
                  <td class="px-2 py-1 font-mono text-white">{{ mission.tag }}</td>
                  <td class="px-2 py-1 text-center text-gray-400">{{ formatNumber(mission.maxCrew) }}</td>
                  <td class="px-2 py-1 text-center" :class="getLeftCrew(mission.tag, mission.maxCrew) > 0 ? 'text-yellow-400' : 'text-gray-500'">{{ getLeftCrew(mission.tag, mission.maxCrew) }}</td>
                  <td class="px-1 py-1">
                    <input
                      :value="getAssignment(mission.tag).T1"
                      @input="updateAssignment(mission.tag, 'T1', $event.target.value)"
                      type="number"
                      min="0"
                      :disabled="!missionPlannerStore.isManualMode(mission.tag)"
                      :class="[
                        'w-12 px-1 py-0.5 border rounded text-xs text-center outline-none',
                        missionPlannerStore.isManualMode(mission.tag)
                          ? 'bg-gray-900 border-gray-600 text-white focus:border-red-500 cursor-text'
                          : 'bg-gray-800/50 border-gray-700/50 text-gray-300 cursor-not-allowed'
                      ]"
                    />
                  </td>
                  <td class="px-1 py-1">
                    <input
                      :value="getAssignment(mission.tag).T2"
                      @input="updateAssignment(mission.tag, 'T2', $event.target.value)"
                      type="number"
                      min="0"
                      :disabled="!missionPlannerStore.isManualMode(mission.tag)"
                      :class="[
                        'w-12 px-1 py-0.5 border rounded text-xs text-center outline-none',
                        missionPlannerStore.isManualMode(mission.tag)
                          ? 'bg-gray-900 border-gray-600 text-white focus:border-orange-500 cursor-text'
                          : 'bg-gray-800/50 border-gray-700/50 text-gray-300 cursor-not-allowed'
                      ]"
                    />
                  </td>
                  <td class="px-1 py-1">
                    <input
                      :value="getAssignment(mission.tag).T3"
                      @input="updateAssignment(mission.tag, 'T3', $event.target.value)"
                      type="number"
                      min="0"
                      :disabled="!missionPlannerStore.isManualMode(mission.tag)"
                      :class="[
                        'w-12 px-1 py-0.5 border rounded text-xs text-center outline-none',
                        missionPlannerStore.isManualMode(mission.tag)
                          ? 'bg-gray-900 border-gray-600 text-white focus:border-yellow-500 cursor-text'
                          : 'bg-gray-800/50 border-gray-700/50 text-gray-300 cursor-not-allowed'
                      ]"
                    />
                  </td>
                  <td class="px-1 py-1">
                    <input
                      :value="getAssignment(mission.tag).T4"
                      @input="updateAssignment(mission.tag, 'T4', $event.target.value)"
                      type="number"
                      min="0"
                      :disabled="!missionPlannerStore.isManualMode(mission.tag)"
                      :class="[
                        'w-12 px-1 py-0.5 border rounded text-xs text-center outline-none',
                        missionPlannerStore.isManualMode(mission.tag)
                          ? 'bg-gray-900 border-gray-600 text-white focus:border-green-500 cursor-text'
                          : 'bg-gray-800/50 border-gray-700/50 text-gray-300 cursor-not-allowed'
                      ]"
                    />
                  </td>
                  <td 
                    class="px-2 py-1 text-right font-mono" 
                    :class="[
                      getMissionStats(mission.tag).isAtCap ? 'text-green-400' : 'text-gray-400',
                      getMissionStats(mission.tag).completionTimeFormatted === '∞' ? 'text-lg leading-none' : ''
                    ]"
                  >
                    {{ getMissionStats(mission.tag).completionTimeFormatted }}
                  </td>
                  <td class="px-2 py-1 text-right font-mono" :style="{ color: getIncomeColor(mission.tag) }">
                    {{ formatNumberWithCommas(getMissionStats(mission.tag).fragsPerHour, 1) }}
                  </td>
                  <td class="px-2 py-1 text-right font-mono" :style="{ color: getIncomeColor(mission.tag) }">
                    {{ formatNumberWithCommas(getMissionStats(mission.tag).fragsPerHour * 24, 0) }}
                  </td>
                  <td class="px-2 py-1 text-right font-mono" :style="{ color: getIncomeColor(mission.tag) }">
                    {{ getIncomePercentage(mission.tag) }}
                  </td>
                  <td class="px-1 py-1 text-center">
                    <button
                      @click="toggleManualMode(mission.tag)"
                      class="w-5 h-5 rounded flex items-center justify-center transition-colors"
                      :class="missionPlannerStore.isManualMode(mission.tag) 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-gray-700 text-gray-500 hover:bg-gray-600'"
                      :title="missionPlannerStore.isManualMode(mission.tag) ? 'Manual Mode ON' : 'Manual Mode OFF'"
                    >
                      <IconLock v-if="missionPlannerStore.isManualMode(mission.tag)" size="12" />
                      <IconLockOpen v-else size="12" />
                    </button>
                  </td>
                </tr>
              </template>
              
              <!-- Campaign Row -->
              <tr class="bg-gray-700/50">
                <td colspan="13" class="px-2 py-1 font-semibold text-purple-400">
                  <IconTarget size="12" class="inline mr-1 -mt-0.5" />
                  Campaign
                </td>
              </tr>
              <tr 
                :class="[
                  'bg-gray-800/40 border-l-2',
                  missionPlannerStore.isCampaignManualMode() ? 'border-l-yellow-500' : 'border-l-transparent'
                ]"
              >
                <!-- Fill Order -->
                <td class="px-1 py-1">
                  <select
                    :value="missionPlannerStore.campaignFillOrder"
                    @change="missionPlannerStore.setCampaignFillOrder(Number($event.target.value))"
                    class="w-10 px-0.5 py-0.5 bg-gray-900 border border-gray-600 rounded text-white text-xs text-center focus:border-purple-500 outline-none cursor-pointer"
                  >
                    <option v-for="n in 17" :key="n" :value="n">{{ n }}</option>
                  </select>
                </td>
                <!-- Mission Tag -->
                <td class="px-2 py-1 font-mono">
                  <span 
                    @click="showCampaignModal = true"
                    class="cursor-pointer hover:text-purple-300 transition-colors"
                    :class="missionPlannerStore.selectedCampaign ? 'text-white' : 'text-gray-500'"
                  >
                    {{ missionPlannerStore.selectedCampaign || 'Select...' }}
                  </span>
                </td>
                <!-- Max Crew -->
                <td class="px-2 py-1 text-center text-gray-400">{{ getSelectedCampaignMaxCrew() }}</td>
                <!-- Left Crew -->
                <td class="px-2 py-1 text-center" :class="getSelectedCampaignLeftCrew() > 0 ? 'text-yellow-400' : 'text-gray-500'">{{ getSelectedCampaignLeftCrew() }}</td>
                <!-- T1 -->
                <td class="px-1 py-1">
                  <input
                    :value="getSelectedCampaignAssignment().T1"
                    @input="updateSelectedCampaignAssignment('T1', $event.target.value)"
                    type="number"
                    min="0"
                    :disabled="!missionPlannerStore.selectedCampaign || !missionPlannerStore.isCampaignManualMode()"
                    :class="[
                      'w-12 px-1 py-0.5 border rounded text-xs text-center outline-none',
                      missionPlannerStore.isCampaignManualMode() && missionPlannerStore.selectedCampaign
                        ? 'bg-gray-900 border-gray-600 text-white focus:border-red-500 cursor-text'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-300 cursor-not-allowed'
                    ]"
                  />
                </td>
                <!-- T2 -->
                <td class="px-1 py-1">
                  <input
                    :value="getSelectedCampaignAssignment().T2"
                    @input="updateSelectedCampaignAssignment('T2', $event.target.value)"
                    type="number"
                    min="0"
                    :disabled="!missionPlannerStore.selectedCampaign || !missionPlannerStore.isCampaignManualMode()"
                    :class="[
                      'w-12 px-1 py-0.5 border rounded text-xs text-center outline-none',
                      missionPlannerStore.isCampaignManualMode() && missionPlannerStore.selectedCampaign
                        ? 'bg-gray-900 border-gray-600 text-white focus:border-orange-500 cursor-text'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-300 cursor-not-allowed'
                    ]"
                  />
                </td>
                <!-- T3 -->
                <td class="px-1 py-1">
                  <input
                    :value="getSelectedCampaignAssignment().T3"
                    @input="updateSelectedCampaignAssignment('T3', $event.target.value)"
                    type="number"
                    min="0"
                    :disabled="!missionPlannerStore.selectedCampaign || !missionPlannerStore.isCampaignManualMode()"
                    :class="[
                      'w-12 px-1 py-0.5 border rounded text-xs text-center outline-none',
                      missionPlannerStore.isCampaignManualMode() && missionPlannerStore.selectedCampaign
                        ? 'bg-gray-900 border-gray-600 text-white focus:border-yellow-500 cursor-text'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-300 cursor-not-allowed'
                    ]"
                  />
                </td>
                <!-- T4 -->
                <td class="px-1 py-1">
                  <input
                    :value="getSelectedCampaignAssignment().T4"
                    @input="updateSelectedCampaignAssignment('T4', $event.target.value)"
                    type="number"
                    min="0"
                    :disabled="!missionPlannerStore.selectedCampaign || !missionPlannerStore.isCampaignManualMode()"
                    :class="[
                      'w-12 px-1 py-0.5 border rounded text-xs text-center outline-none',
                      missionPlannerStore.isCampaignManualMode() && missionPlannerStore.selectedCampaign
                        ? 'bg-gray-900 border-gray-600 text-white focus:border-green-500 cursor-text'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-300 cursor-not-allowed'
                    ]"
                  />
                </td>
                <!-- Time -->
                <td class="px-2 py-1 text-right font-mono text-purple-400">
                  {{ getSelectedCampaignTime() }}
                </td>
                <!-- Frags (instead of Frags/hr) -->
                <td class="px-2 py-1 text-right font-mono text-purple-400">
                  {{ getSelectedCampaignFrags() }}
                </td>
                <!-- Empty for Frags/day -->
                <td class="px-2 py-1"></td>
                <!-- Empty for % -->
                <td class="px-2 py-1"></td>
                <!-- Manual Button -->
                <td class="px-1 py-1 text-center">
                  <button
                    @click="missionPlannerStore.toggleCampaignManualMode()"
                    class="w-5 h-5 rounded flex items-center justify-center transition-colors"
                    :class="missionPlannerStore.isCampaignManualMode() 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-700 text-gray-500 hover:bg-gray-600'"
                    :title="missionPlannerStore.isCampaignManualMode() ? 'Manual Mode ON' : 'Manual Mode OFF'"
                  >
                    <IconLock v-if="missionPlannerStore.isCampaignManualMode()" size="12" />
                    <IconLockOpen v-else size="12" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Relics Tab -->
      <RelicsTab v-if="activeTab === 'relics'" />
    </div>
  </div>
  </div>

  <!-- Campaign Select Modal -->
  <CampaignSelectModal
    :is-visible="showCampaignModal"
    @close="showCampaignModal = false"
    @select="onCampaignSelect"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  IconSword,
  IconRefresh,
  IconTarget,
  IconTrash,
  IconLock,
  IconLockOpen,
  IconPlanet,
  IconFlag
} from '@tabler/icons-vue';
import { PLANETS, FARM_MISSIONS, CAMPAIGN_MISSIONS } from '@/views/tools/mission-planner/constants/missions';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { formatNumber } from '@/composables/format';
import ModifiersPanel from '@/views/tools/mission-planner/components/ModifiersPanel.vue';
import CampaignSelectModal from '@/views/tools/mission-planner/components/CampaignSelectModal.vue';
import CampaignsTab from '@/views/tools/mission-planner/components/CampaignsTab.vue';
import RelicsTab from '@/views/tools/mission-planner/components/RelicsTab.vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';

// Store
const missionPlannerStore = useMissionPlannerStore();

// Tab state - use store's activeMainTab (persisted & can be set by notification click)
const activeTab = computed({
  get: () => missionPlannerStore.activeMainTab,
  set: (value) => { missionPlannerStore.activeMainTab = value; }
});

// Campaign Modal state
const showCampaignModal = ref(false);

// Computed: Available Personnel from store
const availablePersonnel = computed(() => missionPlannerStore.availablePersonnel);

// Computed: Personnel used across all assignments
const personnelUsed = computed(() => missionPlannerStore.getTotalPersonnelUsed());

// Computed: Total frags per hour from all farm missions
const totalFragsPerHour = computed(() => {
  const stats = missionPlannerStore.getCurrentMissionStats();
  return stats.totalFragsPerHour || 0;
});

// Computed: Income stats for all farm missions (for color calculation)
const farmIncomeStats = computed(() => {
  const stats = {};
  let maxIncome = 0;
  let minIncome = Infinity;
  let totalIncome = 0;
  
  FARM_MISSIONS.forEach(mission => {
    const missionStats = getMissionStats(mission.tag);
    const fragsPerDay = (missionStats.fragsPerHour || 0) * 24;
    stats[mission.tag] = fragsPerDay;
    totalIncome += fragsPerDay;
    
    if (fragsPerDay > 0) {
      if (fragsPerDay > maxIncome) maxIncome = fragsPerDay;
      if (fragsPerDay < minIncome) minIncome = fragsPerDay;
    }
  });
  
  // If all are 0, set minIncome to 0
  if (minIncome === Infinity) minIncome = 0;
  
  return { stats, maxIncome, minIncome, totalIncome };
});

// Get color for income based on relative position (red → yellow → green)
// Uses logarithmic scale with bias towards red for low values
function getIncomeColor(missionTag) {
  const { stats, maxIncome, minIncome } = farmIncomeStats.value;
  const income = stats[missionTag] || 0;
  
  if (income === 0 || maxIncome === 0) {
    return '#6b7280'; // gray-500 for no income
  }
  
  // Use logarithmic scale to handle large value ranges better
  const logMin = minIncome > 0 ? Math.log(minIncome) : 0;
  const logMax = Math.log(maxIncome);
  const logIncome = Math.log(income);
  
  const logRange = logMax - logMin;
  let percentage = logRange > 0 ? (logIncome - logMin) / logRange : 1;
  
  // Apply power curve to push low values more towards red
  // This makes values need to be relatively higher to reach yellow/green
  percentage = Math.pow(percentage, 1.2);
  
  // Color gradient: red (0%) → yellow (50%) → green (100%)
  // Red: #ef4444, Yellow: #eab308, Green: #22c55e
  if (percentage <= 0.5) {
    // Red to Yellow (0% to 50%)
    const t = percentage * 2; // 0 to 1
    const r = 239; // stays at 239 (red to yellow)
    const g = Math.round(68 + (179 - 68) * t); // 68 to 179
    const b = Math.round(68 - 60 * t); // 68 to 8
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Green (50% to 100%)
    const t = (percentage - 0.5) * 2; // 0 to 1
    const r = Math.round(234 - (234 - 34) * t); // 234 to 34
    const g = Math.round(179 + (197 - 179) * t); // 179 to 197
    const b = Math.round(8 + (94 - 8) * t); // 8 to 94
    return `rgb(${r}, ${g}, ${b})`;
  }
}

// Get percentage of total income for a mission
function getIncomePercentage(missionTag) {
  const { stats, totalIncome } = farmIncomeStats.value;
  const income = stats[missionTag] || 0;
  
  if (totalIncome === 0 || income === 0) {
    return '0%';
  }
  
  const percentage = (income / totalIncome) * 100;
  return percentage.toFixed(1) + '%';
}

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

// Group campaign missions by planet
const campaignMissionsByPlanet = computed(() => {
  const grouped = {};
  CAMPAIGN_MISSIONS.forEach(mission => {
    if (!grouped[mission.planet]) {
      grouped[mission.planet] = [];
    }
    grouped[mission.planet].push(mission);
  });
  return Object.values(grouped);
});

// Get assignment for a mission
function getAssignment(missionTag) {
  return missionPlannerStore.getAssignment(missionTag);
}

// Get remaining crew slots for a mission
function getLeftCrew(missionTag, maxCrew) {
  const assignment = missionPlannerStore.getAssignment(missionTag);
  const usedCrew = (assignment.T1 || 0) + (assignment.T2 || 0) + (assignment.T3 || 0) + (assignment.T4 || 0);
  return maxCrew - usedCrew;
}

// Update assignment for a mission
function updateAssignment(missionTag, tier, value) {
  const current = missionPlannerStore.getAssignment(missionTag);
  const newValue = parseInt(value) || 0;
  missionPlannerStore.setAssignment(missionTag, {
    ...current,
    [tier]: newValue
  });
}

// Toggle manual mode
function toggleManualMode(missionTag) {
  missionPlannerStore.toggleManualMode(missionTag);
}

// Update fill order for a mission
function updateFillOrder(missionTag, value) {
  const newOrder = parseInt(value) || 1;
  missionPlannerStore.setFillOrder(missionTag, newOrder);
}

// Get stats for a farm mission
function getMissionStats(missionTag) {
  const mission = FARM_MISSIONS.find(m => m.tag === missionTag);
  if (!mission) return { completionTimeFormatted: '∞', fragsPerHour: 0, isAtCap: false };
  
  const personnel = missionPlannerStore.getAssignment(missionTag);
  return missionPlannerStore.getMissionStats(mission, personnel);
}

// Get stats for a campaign mission
function getCampaignMissionStats(missionTag) {
  const mission = CAMPAIGN_MISSIONS.find(m => m.tag === missionTag);
  if (!mission) return { completionTimeFormatted: '∞', fragsPerCompletion: 0 };
  
  const personnel = missionPlannerStore.getAssignment(missionTag);
  return missionPlannerStore.getMissionStats(mission, personnel);
}

// Format number with comma as thousand separator
// Rounds values >= 1000, otherwise floors
function formatNumberWithCommas(num, decimals = 0) {
  if (num === undefined || num === null) return '0';
  if (!isFinite(num)) return '∞';
  
  let value;
  if (decimals > 0) {
    value = num.toFixed(decimals);
  } else {
    // Round for large numbers, floor for small
    value = (num >= 1000 ? Math.round(num) : Math.floor(num)).toString();
  }
  
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

// Handle clear all button
function handleClearAll() {
  missionPlannerStore.clearAllAssignments();
}

// Handle reset targets button (for Relics tab)
function handleResetTargets() {
  // Reset all target levels to current levels
  const tier1RelicIds = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14'];
  tier1RelicIds.forEach(relicId => {
    const currentLevel = missionPlannerStore.relicLevels[relicId] || 0;
    missionPlannerStore.relicTargetLevels[relicId] = currentLevel;
  });
}

// Campaign selection handler
function onCampaignSelect(campaignTag) {
  // Campaign is already set in the modal via store action
  // This is just for any additional handling if needed
}

// Get selected campaign estimated time
function getSelectedCampaignTime() {
  const result = missionPlannerStore.getSelectedCampaignEstimatedTime();
  if (!result) return '-';
  return result.formatted;
}

// Get selected campaign assignment
function getSelectedCampaignAssignment() {
  if (!missionPlannerStore.selectedCampaign) {
    return { T1: 0, T2: 0, T3: 0, T4: 0 };
  }
  return missionPlannerStore.getAssignment(missionPlannerStore.selectedCampaign);
}

// Update selected campaign assignment
function updateSelectedCampaignAssignment(tier, value) {
  if (!missionPlannerStore.selectedCampaign) return;
  const current = getSelectedCampaignAssignment();
  const newValue = parseInt(value) || 0;
  missionPlannerStore.setAssignment(missionPlannerStore.selectedCampaign, {
    ...current,
    [tier]: newValue
  });
}

// Get selected campaign max crew
function getSelectedCampaignMaxCrew() {
  const campaign = missionPlannerStore.getSelectedCampaignData();
  if (!campaign) return '-';
  return formatNumber(campaign.maxCrew);
}

// Get selected campaign left crew
function getSelectedCampaignLeftCrew() {
  const campaign = missionPlannerStore.getSelectedCampaignData();
  if (!campaign) return '-';
  const assignment = getSelectedCampaignAssignment();
  const usedCrew = (assignment.T1 || 0) + (assignment.T2 || 0) + (assignment.T3 || 0) + (assignment.T4 || 0);
  return campaign.maxCrew - usedCrew;
}

// Get selected campaign fragments
function getSelectedCampaignFrags() {
  if (!missionPlannerStore.selectedCampaign) return '-';
  const campaign = missionPlannerStore.getSelectedCampaignData();
  if (!campaign) return '-';
  const stats = missionPlannerStore.getMissionStats(campaign, getSelectedCampaignAssignment());
  return formatNumberWithCommas(stats.fragsPerCompletion || 0, 0);
}

// Initialize store on mount
onMounted(() => {
  missionPlannerStore.initialize();
});
</script>

<style scoped>
/* Remove spinner from number inputs */
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
