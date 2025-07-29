<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-[60] overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-[95%] max-w-6xl max-h-[95vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
        <div>
          <h3 class="text-lg font-bold text-white flex items-center">
            <IconClock size="20" class="mr-2 text-blue-400" />
            Time Drift Statistics - {{ track?.name }}
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="20" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-6">
        <!-- Overall Summary -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gray-700/30 rounded-lg p-4">
            <div class="text-xs text-gray-400 mb-1">Total Real Time</div>
            <div class="text-lg font-bold text-yellow-400">{{ formatTimeHours(detailedStats.realTimeHours) }}</div>
          </div>
          <div class="bg-gray-700/30 rounded-lg p-4">
            <div class="text-xs text-gray-400 mb-1">Total Game Time</div>
            <div class="text-lg font-bold text-purple-400">{{ formatTimeHours(detailedStats.gameTimeHours) }}</div>
          </div>
          <div class="bg-gray-700/30 rounded-lg p-4">
            <div class="text-xs text-gray-400 mb-1">Total Drift Time in TR</div>
            <div class="text-lg font-bold" :class="{
              'text-red-400': detailedStats.totalDriftHours > 0,
              'text-green-400': detailedStats.totalDriftHours < 0,
              'text-gray-400': Math.abs(detailedStats.totalDriftHours) < 0.1
            }">
              {{ formatTimeHours(Math.abs(detailedStats.totalDriftHours)) }} {{ detailedStats.totalDriftHours < 0 ? 'gained' : 'lost' }}
            </div>
          </div>
          <div class="bg-gray-700/30 rounded-lg p-4">
            <div class="text-xs text-gray-400 mb-1">Total Drift Camp Timer</div>
            <div class="text-lg font-bold" :class="{
              'text-red-400': detailedStats.campTimerDriftHours > 0,
              'text-green-400': detailedStats.campTimerDriftHours < 0,
              'text-gray-400': Math.abs(detailedStats.campTimerDriftHours) < 0.1
            }">
              {{ detailedStats.campTimerDriftHours !== null ? formatTimeHours(Math.abs(detailedStats.campTimerDriftHours)) + ' ' + (detailedStats.campTimerDriftHours < 0 ? 'gained' : 'lost') : 'N/A' }}
            </div>
          </div>
        </div>

        <!-- Day-by-Day Analysis -->
        <div>
          <div class="flex items-center mb-3">
            <div class="w-1.5 h-6 bg-blue-500 rounded-r mr-2"></div>
            <h4 class="font-semibold text-lg text-blue-200">Day-by-Day Analysis</h4>
          </div>
          
          <div class="bg-gray-700/20 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-600/50">
                  <tr>
                    <th class="text-left p-3 text-gray-300">Date</th>
                    <th class="text-left p-3 pr-0 text-gray-300">Real Time Elapsed</th>
                    <th class="text-left p-3 pl-6text-gray-300 border-l border-gray-500">Time in TR</th>
                    <th class="text-left p-3 text-gray-300">Time in TR El.</th>
                    <th class="text-left p-3 text-gray-300">Session Drift</th>
                    <th class="text-left p-3 text-gray-300 border-l border-gray-500">Camp Timer</th>
                    <th class="text-left p-3 text-gray-300">Camp Timer El.</th>
                    <th class="text-left p-3 text-gray-300">Session Drift</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(dayStats, index) in detailedStats.dailyBreakdown"
                    :key="index"
                    class="border-b border-gray-600/30 hover:bg-gray-600/20"
                  >
                    <td class="p-3 text-gray-200">
                      {{ formatLogDate(dayStats.date) }}
                    </td>
                    <td class="p-3 text-purple-400">
                      {{ dayStats.realTimeElapsed !== null ? formatTimeHours(dayStats.realTimeElapsed) : '-' }}
                    </td>
                    <td class="p-3 text-yellow-400 border-l border-gray-500">
                      {{ dayStats.timeInTR || '-' }}
                    </td>
                    <td class="p-3 text-purple-400">
                      {{ dayStats.gameTimeElapsed !== null ? formatTimeHours(dayStats.gameTimeElapsed) : '-' }}
                    </td>
                    <td class="p-3" :class="{
                      'text-red-400': dayStats.sessionDrift && dayStats.sessionDrift > 0.1,
                      'text-green-400': dayStats.sessionDrift && dayStats.sessionDrift < -0.1,
                      'text-gray-400': dayStats.sessionDrift === null || Math.abs(dayStats.sessionDrift) <= 0.1
                    }">
                      {{ dayStats.sessionDrift !== null ? formatTimeDrift(dayStats.sessionDrift) : '-' }}
                    </td>
                    <td class="p-3 text-yellow-400 border-l border-gray-500">
                      {{ dayStats.campTimer || 'N/A' }}
                      <div v-if="dayStats.currentCamp" class="text-xs text-gray-400">
                        {{ dayStats.currentCamp }}
                      </div>
                    </td>
                    <td class="p-3 text-purple-400">
                      <span v-if="dayStats.isReference" class="text-gray-400">-</span>
                      <span v-else-if="dayStats.isNewCamp" class="text-gray-400">-</span>
                      <span v-else-if="dayStats.campTimerElapsed !== null && dayStats.campTimerElapsed !== undefined">{{ formatTimeHours(Math.abs(dayStats.campTimerElapsed)) }}</span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="p-3">
                      <span v-if="dayStats.isReference || dayStats.isNewCamp" class="text-gray-400">-</span>
                      <span v-else-if="dayStats.timerVsRealDiff !== null" 
                            :class="{
                              'text-red-400': dayStats.timerVsRealDiff > 0.02,
                              'text-green-400': dayStats.timerVsRealDiff < -0.02,
                              'text-gray-400': Math.abs(dayStats.timerVsRealDiff) <= 0.02
                            }">
                        {{ formatTimeDrift(dayStats.timerVsRealDiff) }}
                      </span>
                      <span v-else class="text-gray-400">N/A</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end pt-3 border-t border-gray-700 px-4 pb-4">
        <button
          @click="$emit('close')"
          class="px-3 py-1.5 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-xs"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconX, IconClock } from '@tabler/icons-vue';

const props = defineProps({
  show: Boolean,
  track: Object,
  selectedResources: Array
});

defineEmits(['close']);

// Parse time format
const parseTimeToHours = (timeStr) => {
  if (!timeStr || timeStr === '') return 0;
  const parts = String(timeStr).split(':');
  if (parts.length !== 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours + (minutes / 60);
};

// Get track duration in days
const getTrackDuration = () => {
  if (!props.track) return 0;
  
  const startDate = new Date(props.track.startDate);
  const endDate = props.track.endDate ? new Date(props.track.endDate) : new Date();
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Main detailed statistics computation
const detailedStats = computed(() => {
  if (!props.track || !props.track.entries || props.track.entries.length < 2) {
    return {
      realTimeHours: 0,
      gameTimeHours: 0,
      totalDriftHours: 0,
      avgDailyDrift: 0,
      dailyBreakdown: [],
      campTimerStats: { hasData: false },
      insights: []
    };
  }

  // Sort entries chronologically
  const sortedEntries = [...props.track.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Check if hours-in-tr resource is available
  const hoursInTrResource = props.selectedResources?.find(r => r.id === 'hours-in-tr');
  if (!hoursInTrResource) {
    return {
      realTimeHours: 0,
      gameTimeHours: 0,
      totalDriftHours: 0,
      avgDailyDrift: 0,
      dailyBreakdown: [],
      campTimerStats: { hasData: false },
      insights: [{ title: 'No Time Data', description: 'Hours-in-TR not being tracked.', severity: 'high' }]
    };
  }

  // Calculate overall stats
  const firstEntry = sortedEntries[0];
  const lastEntry = sortedEntries[sortedEntries.length - 1];
  const realTimeStart = new Date(firstEntry.date);
  const realTimeEnd = new Date(lastEntry.date);
  const realTimeHours = (realTimeEnd - realTimeStart) / (1000 * 60 * 60);
  
  const gameTimeStart = parseTimeToHours(firstEntry.values?.['hours-in-tr'] || '0:00');
  const gameTimeEnd = parseTimeToHours(lastEntry.values?.['hours-in-tr'] || '0:00');
  const gameTimeHours = gameTimeEnd - gameTimeStart;
  
  const totalDriftHours = realTimeHours - gameTimeHours;
  const trackDuration = getTrackDuration();
  const avgDailyDrift = trackDuration > 0 ? totalDriftHours / trackDuration : 0;

  // Day-by-day breakdown with camp timer tracking
  const dailyBreakdown = [];
  let cumulativeDrift = 0;
  
  // Find the first entry with a camp timer to use as reference
  const firstCampTimerEntry = sortedEntries.find(entry => entry.values?.['camp-timer']);
  const initialCampTimer = firstCampTimerEntry ? parseTimeToHours(firstCampTimerEntry.values['camp-timer']) : null;
  const campStartTime = firstCampTimerEntry ? new Date(firstCampTimerEntry.date) : null;
  const campStartGameTime = firstCampTimerEntry ? parseTimeToHours(firstCampTimerEntry.values?.['hours-in-tr'] || '0:00') : null;
  
  // Add the first entry as reference (no drift values)
  if (sortedEntries.length > 0) {
    const firstEntry = sortedEntries[0];
    dailyBreakdown.push({
      date: firstEntry.date,
      timeInTR: firstEntry.values?.['hours-in-tr'] || '-',
      realTimeElapsed: null, // No comparison for first entry
      gameTimeElapsed: null, // No comparison for first entry
      sessionDrift: null,    // No drift for first entry
      cumulativeDrift: null, // No cumulative drift for first entry
      campTimer: firstEntry.values?.['camp-timer'] || '',
      currentCamp: firstEntry.values?.['current-camp'] || '',
      timerVsGameDiff: null, // No comparison for first entry
      campTimerElapsed: null, // No elapsed time for first entry
      timerVsRealDiff: null, // No comparison for first entry
      isNewCamp: false,
      isReference: true      // Mark as reference entry
    });
  }
  
  for (let i = 1; i < sortedEntries.length; i++) {
    const prevEntry = sortedEntries[i - 1];
    const currentEntry = sortedEntries[i];
    
    const realTimeElapsed = (new Date(currentEntry.date) - new Date(prevEntry.date)) / (1000 * 60 * 60);
    const gameTimeElapsed = parseTimeToHours(currentEntry.values?.['hours-in-tr'] || '0:00') - 
                          parseTimeToHours(prevEntry.values?.['hours-in-tr'] || '0:00');
    
    const sessionDrift = realTimeElapsed - gameTimeElapsed;
    cumulativeDrift += sessionDrift;
    
    // Camp timer analysis
    const campTimer = currentEntry.values?.['camp-timer'] || '';
    const currentCamp = currentEntry.values?.['current-camp'] || '';
    const prevCampTimer = prevEntry.values?.['camp-timer'] || '';
    const prevCamp = prevEntry.values?.['current-camp'] || '';
    
    let timerVsGameDiff = null;
    let timerVsRealDiff = null;
    let campTimerElapsed = null;
    let isNewCamp = false;
    
    // Check if this is a new camp (different camp name or no previous camp timer but current has one)
    if (currentCamp && prevCamp && currentCamp !== prevCamp) {
      isNewCamp = true;
    } else if (campTimer && !prevCampTimer) {
      isNewCamp = true;
    }
    
    // Calculate camp timer elapsed (only if same camp and both have timers)
    if (campTimer && prevCampTimer && !isNewCamp && currentCamp === prevCamp) {
      const currentCampTimerHours = parseTimeToHours(campTimer);
      const prevCampTimerHours = parseTimeToHours(prevCampTimer);
      // Camp timer counts down, so elapsed = previous - current
      campTimerElapsed = prevCampTimerHours - currentCampTimerHours;
      
      // Calculate timer vs real time drift (camp timer elapsed vs real time elapsed)
      if (campTimerElapsed !== null && realTimeElapsed !== null) {
        // For camp timer: if campTimerElapsed < realTimeElapsed, timer is running slow (time lost)
        // So we reverse the sign: realTimeElapsed - campTimerElapsed 
        timerVsRealDiff = realTimeElapsed - campTimerElapsed;
      }
    }
    
    dailyBreakdown.push({
      date: currentEntry.date,
      timeInTR: currentEntry.values?.['hours-in-tr'] || '-',
      realTimeElapsed,
      gameTimeElapsed,
      sessionDrift,
      cumulativeDrift,
      campTimer,
      currentCamp,
      timerVsGameDiff,
      campTimerElapsed,
      timerVsRealDiff,
      isNewCamp,
      isReference: false
    });
  }

  // Reverse the array to show newest entries first
  dailyBreakdown.reverse();

  // Calculate total camp timer drift
  let campTimerDriftHours = null;
  const timerDriftEntries = dailyBreakdown.filter(entry => entry.timerVsRealDiff !== null);
  if (timerDriftEntries.length > 0) {
    campTimerDriftHours = timerDriftEntries.reduce((sum, entry) => sum + entry.timerVsRealDiff, 0);
  }

  return {
    realTimeHours,
    gameTimeHours,
    totalDriftHours,
    campTimerDriftHours,
    avgDailyDrift,
    dailyBreakdown
  };
});

// Formatting helper functions
function formatTimeHours(hours) {
  if (isNaN(hours) || hours < 0) return '0h 0m';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  // Handle minute overflow (e.g., 7h 60m should become 8h 0m)
  if (m >= 60) {
    const additionalHours = Math.floor(m / 60);
    const remainingMinutes = m % 60;
    const totalHours = h + additionalHours;
    
    if (remainingMinutes === 0) return `${totalHours}h 0m`;
    return `${totalHours}h ${remainingMinutes}m`;
  }
  
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatTimeDrift(drift) {
  if (Math.abs(drift) < 0.05) return '±0m';
  const hours = Math.floor(Math.abs(drift));
  const minutes = Math.round((Math.abs(drift) - hours) * 60);
  
  // Positive drift = time lost (bad) = show with - (minus sign)
  // Negative drift = time gained (good) = show without sign (no minus)
  const sign = drift > 0 ? '-' : '';  // Show - for positive (time lost), no sign for negative (time gained)
  
  if (hours === 0) return `${sign}${minutes}m`;
  if (minutes === 0) return `${sign}${hours}h`;
  return `${sign}${hours}h ${minutes}m`;
}

function formatLogDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
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
