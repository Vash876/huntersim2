<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/builds/card-components/BuildBossStats.vue -->
<template>
  <div>
    <h4 class="section-title">Boss Statistics</h4>
    
    <div class="boss-stats-grid mt-3">
      <!-- Boss HP -->
      <div v-if="results.bossHpPercent !== '--'" class="boss-stat-card">
        <div class="boss-stat-header">
          <div class="flex items-center">
            <IconHeartFilled :size="24" class="text-red-400 mr-1.5" />
            <span class="boss-stat-title">{{ resultLabels.bossHpPercent }}</span>
          </div>
          <span 
            v-if="!isReferenceBuild && referenceResults?.bossHpPercent !== '--' && results.bossHpPercent !== '--'"
            :class="getBossStatDiffClasses(results.bossHpPercent, referenceResults.bossHpPercent, false)"
            class="boss-stat-diff"
          >
            {{ getBossStatDiffText(results.bossHpPercent, referenceResults.bossHpPercent) }}%
          </span>
        </div>
        <div class="boss-stat-value">{{ formatPercent(results.bossHpPercent) }}</div>
        <div class="boss-progress">
          <div class="boss-progress-bg"></div>
          <div class="boss-progress-fill bg-red-500" :style="{width: `${results.bossHpPercent}%`}"></div>
        </div>
      </div>
      
      <!-- Boss Kill Rate -->
      <div v-if="results.bossKillRate !== '--'" class="boss-stat-card">
        <div class="boss-stat-header">
          <div class="flex items-center">
            <IconSword :size="24" class="text-emerald-400 mr-1.5" />
            <span class="boss-stat-title">{{ resultLabels.bossKillRate }}</span>
          </div>
          <span 
            v-if="!isReferenceBuild && referenceResults?.bossKillRate !== '--' && results.bossKillRate !== '--'"
            :class="getBossStatDiffClasses(results.bossKillRate, referenceResults.bossKillRate, true)"
            class="boss-stat-diff"
          >
            {{ getBossStatDiffText(results.bossKillRate, referenceResults.bossKillRate) }}%
          </span>
        </div>
        <div class="boss-stat-value">{{ formatPercent(results.bossKillRate) }}</div>
        <div class="boss-progress">
          <div class="boss-progress-bg"></div>
          <div class="boss-progress-fill bg-emerald-500" :style="{width: `${results.bossKillRate}%`}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconHeartFilled, IconSword } from '@tabler/icons-vue';
import { 
  getBossStatDiffClasses, getBossStatDiffText, formatPercent 
} from '../utils/BuildComparisonUtils';

const props = defineProps({
  results: { type: Object, required: true },
  referenceResults: { type: Object, default: () => ({}) },
  isReferenceBuild: { type: Boolean, default: false },
  resultLabels: { type: Object, required: true }
});
</script>

<style scoped>
.section-title {
  font-weight: 600;
  font-size: 1rem;
  color: rgba(229, 231, 235, 1);
  border-bottom: 1px solid rgba(75, 85, 99, 0.4);
  padding-bottom: 0.5rem;
}

.boss-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.boss-stat-card {
  background-color: rgba(31, 41, 55, 0.4);
  border-radius: 0.5rem;
  padding: 0.75rem;
  height: 100%;
  transition: transform 0.1s ease;
}

.boss-stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.boss-stat-title {
  font-size: 0.75rem;
  color: rgba(209, 213, 219, 0.9);
}

.boss-stat-diff {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.125rem 0.3125rem;
  border-radius: 0.25rem;
}

.boss-stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.boss-progress {
  position: relative;
  height: 0.375rem;
  overflow: hidden;
  border-radius: 9999px;
  margin-top: 0.25rem;
}

.boss-progress-bg {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(55, 65, 81, 0.3);
}

.boss-progress-fill {
  position: absolute;
  height: 100%;
  transition: width 0.5s ease-out;
}

@media (max-width: 640px) {
  .boss-stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Diff-Klassen */
.text-emerald-400 {
  background-color: rgba(16, 185, 129, 0.15);
  color: rgba(52, 211, 153, 1);
}

.text-red-400 {
  background-color: rgba(239, 68, 68, 0.15);
  color: rgba(248, 113, 113, 1);
}

.text-gray-400 {
  background-color: rgba(75, 85, 99, 0.15);
  color: rgba(156, 163, 175, 1);
}
</style>