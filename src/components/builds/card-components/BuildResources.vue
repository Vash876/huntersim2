<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/builds/card-components/BuildResources.vue -->
<template>
  <div>
    <h4 class="section-title">Loot</h4>
    <div class="resource-grid mt-3">
      <!-- XP-Karte -->
      <div class="resource-card border-blue-600/30">
        <div class="resource-icon bg-blue-900/20">
          <IconBrightness :size="18" class="text-blue-300" />
        </div>
        <div class="resource-content">
          <div class="flex justify-between items-center mb-1.5">
            <span class="resource-label">{{ resultLabels.xp }}</span>
            <span 
              v-if="!isReferenceBuild && referenceResults?.xp && results.xp"
              :class="getDiffClasses(results.xp, referenceResults.xp, true, true)"
              class="comparison-chip"
            >
              <component :is="getDiffIcon(results.xp, referenceResults.xp, true)" :size="12" />
              <span class="ml-0.5">{{ getDiffText(results.xp, referenceResults.xp, true) }}</span>
            </span>
          </div>
          <div class="resource-values">
            <div>
              <span class="value text-blue-300">{{ formatNumber(results.xp) }}</span>
              <span class="unit">per run</span>
            </div>
            <div>
              <span class="value text-blue-300">{{ formatNumber(calculatePerDay(results.xp, results.avgTime)) }}</span>
              <span class="unit">per day</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Material 1 -->
      <div class="resource-card border-red-600/30">
        <div class="resource-icon bg-red-900/20">
          <IconDiamond :size="18" class="text-red-300" />
        </div>
        <div class="resource-content">
          <div class="flex justify-between items-center mb-1.5">
            <span class="resource-label">{{ resultLabels.mat1 }}</span>
            <span 
              v-if="!isReferenceBuild && referenceResults?.mat1 && results.mat1"
              :class="getDiffClasses(results.mat1, referenceResults.mat1, true, true)"
              class="comparison-chip"
            >
              <component :is="getDiffIcon(results.mat1, referenceResults.mat1, true)" :size="12" />
              <span class="ml-0.5">{{ getDiffText(results.mat1, referenceResults.mat1, true) }}</span>
            </span>
          </div>
          <div class="resource-values">
            <div>
              <span class="value text-red-300">{{ formatNumber(results.mat1) }}</span>
              <span class="unit">per run</span>
            </div>
            <div>
              <span class="value text-red-300">{{ formatNumber(calculatePerDay(results.mat1, results.avgTime)) }}</span>
              <span class="unit">per day</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Material 2 -->
      <div class="resource-card border-orange-600/30">
        <div class="resource-icon bg-orange-900/20">
          <IconHexagon :size="18" class="text-orange-300" />
        </div>
        <div class="resource-content">
          <div class="flex justify-between items-center mb-1.5">
            <span class="resource-label">{{ resultLabels.mat2 }}</span>
            <span 
              v-if="!isReferenceBuild && referenceResults?.mat2 && results.mat2"
              :class="getDiffClasses(results.mat2, referenceResults.mat2, true, true)"
              class="comparison-chip"
            >
              <component :is="getDiffIcon(results.mat2, referenceResults.mat2, true)" :size="12" />
              <span class="ml-0.5">{{ getDiffText(results.mat2, referenceResults.mat2, true) }}</span>
            </span>
          </div>
          <div class="resource-values">
            <div>
              <span class="value text-orange-300">{{ formatNumber(results.mat2) }}</span>
              <span class="unit">per run</span>
            </div>
            <div>
              <span class="value text-orange-300">{{ formatNumber(calculatePerDay(results.mat2, results.avgTime)) }}</span>
              <span class="unit">per day</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Material 3 -->
      <div class="resource-card border-amber-600/30">
        <div class="resource-icon bg-amber-900/20">
          <IconHexagons :size="18" class="text-amber-300" />
        </div>
        <div class="resource-content">
          <div class="flex justify-between items-center mb-1.5">
            <span class="resource-label">{{ resultLabels.mat3 }}</span>
            <span 
              v-if="!isReferenceBuild && referenceResults?.mat3 && results.mat3"
              :class="getDiffClasses(results.mat3, referenceResults.mat3, true, true)"
              class="comparison-chip"
            >
              <component :is="getDiffIcon(results.mat3, referenceResults.mat3, true)" :size="12" />
              <span class="ml-0.5">{{ getDiffText(results.mat3, referenceResults.mat3, true) }}</span>
            </span>
          </div>
          <div class="resource-values">
            <div>
              <span class="value text-amber-300">{{ formatNumber(results.mat3) }}</span>
              <span class="unit">per run</span>
            </div>
            <div>
              <span class="value text-amber-300">{{ formatNumber(calculatePerDay(results.mat3, results.avgTime)) }}</span>
              <span class="unit">per day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  IconBrightness, IconDiamond, IconHexagon, IconHexagons,
  IconArrowUp, IconArrowDown, IconEqual
} from '@tabler/icons-vue';
import { 
  getDiffClasses, getDiffIcon, getDiffText,
  formatNumber, calculatePerDay
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

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.75rem;
}

.resource-card {
  display: flex;
  background-color: rgba(31, 41, 55, 0.4);
  border-radius: 0.5rem;
  padding: 0.75rem;
  border-left-width: 2px;
  gap: 0.75rem;
  transition: transform 0.1s ease;
}

.resource-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

.resource-content {
  flex-grow: 1;
  min-width: 0;
}

.resource-label {
  font-size: 0.75rem;
  color: rgba(156, 163, 175, 1);
}

.resource-values {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.value {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.unit {
  display: block;
  font-size: 0.6875rem;
  color: rgba(156, 163, 175, 0.8);
  line-height: 1;
}

.comparison-chip {
  display: flex;
  align-items: center;
  padding: 0.125rem 0.3125rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

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

/* Responsive */
@media (max-width: 300px) {
  .resource-values {
    grid-template-columns: 1fr;
    gap: 0.375rem;
  }
}
</style>