<template>
  <div class="stats-container">  
    <div class="flex items-center justify-between">
      <h4 class="section-title">Main Statistics</h4>
      <button 
        @click="emit('screenshot')"
        class="action-button-compact"
        title="Screenshot to clipboard"
      >
        <IconCamera :size="16" />
      </button>
    </div>
    <div class="border-b border-gray-700/40 -mt-2 mb-1"></div>
    <!-- Grid für wichtigsten Spielstatistiken -->
    <div class="stats-grid">
      <!-- Loot Score -->
      <div class="stat-card">
        <div class="stat-header justify-between">
          <div class="flex items-center">
            <IconReportMoney :size="16" class="text-amber-400" />
            <span class="stat-title">Loot Score</span>
            <InfoTooltip v-if="props.isReferenceBuild"
              content="Overall Build Efficiency Rating that excludes pure loot bonuses (Ultima, etc). This allows for fair Build comparison, focusing only on the Build's core effectiveness."
              placement="top"
              class="ml-0.5"
            />
          </div>
          <div 
            v-if="!props.isReferenceBuild && props.referenceResults?.lootPerMin"
            class="flex items-center"
          >
            <div :class="getDiffClasses(results.lootPerMin, props.referenceResults.lootPerMin, true, true)" class="whitespace-nowrap inline-flex items-center">
              <component :is="getDiffIcon(results.lootPerMin, props.referenceResults.lootPerMin)" size="11" class="mr-0.5 flex-shrink-0" />
              <span>{{ getDiffText(results.lootPerMin, props.referenceResults.lootPerMin) }}</span>
            </div>
          </div>
        </div>
        <div class="stat-value-row">
          <div class="stat-main-value">{{ formatNumber(results.lootPerMin || 0) }}</div>
        </div>
      </div>

      <!-- Run Time -->
      <div class="stat-card">
        <div class="stat-header justify-between">
          <div class="flex items-center">
            <IconClock :size="16" class="text-blue-400" />
            <span class="stat-title">{{ resultLabels.avgTime }}</span>
          </div>
          <div 
            v-if="!props.isReferenceBuild && props.referenceResults?.avgTime"
            class="flex items-center"
          >
            <div :class="getTimeDiffClasses(results.avgTime, props.referenceResults.avgTime, true)" class="whitespace-nowrap inline-flex items-center">
              <component :is="getDiffIcon(props.referenceResults.avgTime, results.avgTime)" size="11" class="mr-0.5 flex-shrink-0" />
              <span>{{ getTimeDiffText(results.avgTime, props.referenceResults.avgTime) }}</span>
            </div>
          </div>
        </div>
        <div class="stat-value-row">
          <div class="stat-main-value">{{ formatTime(results.avgTime) }}</div>
        </div>
      </div>
      
      <!-- Average Stage -->
      <div class="stat-card">
        <div class="stat-header justify-between">
          <div class="flex items-center">
            <IconStairs :size="16" :class="`text-${hunterColor}-400`" />
            <span class="stat-title">{{ resultLabels.avgStage }}</span>
          </div>
          <div 
            v-if="!props.isReferenceBuild && props.referenceResults?.avgStage"
            class="flex items-center"
          >
            <div :class="getAbsoluteDiffClasses(results.avgStage, props.referenceResults.avgStage, true, true)" class="whitespace-nowrap inline-flex items-center">
              <component :is="getDiffIcon(results.avgStage, props.referenceResults.avgStage)" size="11" class="mr-0.5 flex-shrink-0" />
              <span>{{ getAbsoluteDiffText(results.avgStage, props.referenceResults.avgStage) }}</span>
            </div>
          </div>
        </div>
        <div class="stat-value-row">
          <div class="flex items-baseline">
            <div class="stat-main-value">{{ formatStage(results.avgStage, true) }}</div>
            <div class="stat-range ml-2">{{ formatStage(results.minStage) }}-{{ formatStage(results.maxStage) }}</div>
          </div>
        </div>
      </div>
      
      <!-- Runs per Day -->
      <div class="stat-card">
        <div class="stat-header">
          <IconRepeat :size="16" class="text-purple-400" />
          <span class="stat-title">Runs per Day</span>
        </div>
        <div class="stat-value-row">
          <div class="stat-main-value">{{ formatNumber(calculateRunsPerDay(results.avgTime)) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  IconReportMoney, IconStairs, IconClock, IconRepeat, 
  IconArrowUp, IconArrowDown, IconEqual, IconCamera
} from '@tabler/icons-vue';
import { 
  formatNumber, formatStage, formatTime, 
  getDiffClasses, getTimeDiffClasses, getAbsoluteDiffClasses,
  getDiffIcon, getDiffText, getAbsoluteDiffText, getTimeDiffText,
  calculateRunsPerDay
} from '../../utils/BuildComparisonUtils';
import InfoTooltip from '@/composables/InfoTooltip.vue';

const props = defineProps({
  results: { type: Object, required: true },
  referenceResults: { type: Object, default: () => ({}) },
  isReferenceBuild: { type: Boolean, default: false },
  hunterColor: { type: String, required: true },
  resultLabels: { type: Object, required: true }
});

const emit = defineEmits(['screenshot']);
</script>

<style scoped>
.section-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: rgba(229, 231, 235, 1);
  padding-bottom: 0.5rem;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

/* Statistik-Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  gap: 0.25rem;
}

.stat-card {
  background-color: rgba(31, 41, 55, 0.4);
  border-radius: 0.5rem;
  padding: 0.45rem;
  height: 100%;
  transition: transform 0.1s ease;
}

.stat-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  position: relative;
}

.stat-title {
  margin-left: 0.375rem;
  font-size: 0.75rem;
  color: rgba(209, 213, 219, 0.9);
}

.stat-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.stat-main-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
}

.stat-range {
  font-size: 0.6875rem;
  color: rgba(156, 163, 175, 0.8);
}

.action-button-compact {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: rgba(55, 65, 81, 0.3);
  color: rgba(209, 213, 219, 1);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-button-compact:hover {
  background-color: rgba(75, 85, 99, 0.5);
}

/* Nur für sehr kleine Bildschirme alles untereinander */
@media (max-width: 360px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>