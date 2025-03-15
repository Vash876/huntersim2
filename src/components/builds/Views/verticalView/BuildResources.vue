<template>
  <div>
    <h4 class="section-title">Loot</h4>
    <div class="resource-grid mt-3">
      
      <!-- Material 1 -->
      <div class="resource-card border-red-600/30">
        <div class="resource-icon bg-red-900/20">
          <IconDiamond :size="18" class="text-red-300" />
        </div>
        <div class="resource-content">
          <div class="grid grid-cols-3 mb-1.5">
            <span class="resource-label self-center">{{ resultLabels.mat1 }}</span>
            <div class="flex justify-center">
              <div 
                v-if="!isReferenceBuild && referenceResults?.mat1 && results.mat1"
                class="flex items-center mr-15"
              >
                <div :class="getDiffClasses(results.mat1, referenceResults.mat1, true, true)" class="whitespace-nowrap inline-flex items-center text-xs">
                  <component :is="getDiffIcon(results.mat1, referenceResults.mat1)" size="11" class="mr-0.5 flex-shrink-0" />
                  <span>{{ getDiffText(results.mat1, referenceResults.mat1) }}</span>
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <div 
                v-if="!isReferenceBuild && referenceResults?.mat1 && referenceResults?.avgTime && results.mat1 && results.avgTime"
                class="flex items-center"
              >
                <div :class="getDiffClasses(
                  calculatePerDay(results.mat1, results.avgTime), 
                  calculatePerDay(referenceResults.mat1, referenceResults.avgTime), 
                  true, 
                  true
                )" class="whitespace-nowrap inline-flex items-center text-xs">
                  <component :is="getDiffIcon(
                    calculatePerDay(results.mat1, results.avgTime), 
                    calculatePerDay(referenceResults.mat1, referenceResults.avgTime)
                  )" size="11" class="mr-0.5 flex-shrink-0" />
                  <span>{{ getDiffText(
                    calculatePerDay(results.mat1, results.avgTime), 
                    calculatePerDay(referenceResults.mat1, referenceResults.avgTime)
                  ) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="resource-values">
            <div class="flex flex-col">
              <span class="value text-red-300">{{ formatNumber(results.mat1) }}</span>
              <span class="unit">per run</span>
            </div>
            <div class="flex flex-col">
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
          <div class="grid grid-cols-3 mb-1.5">
            <span class="resource-label self-center">{{ resultLabels.mat2 }}</span>
            <div class="flex justify-center">
              <div 
                v-if="!isReferenceBuild && referenceResults?.mat2 && results.mat2"
                class="flex items-center mr-15"
              >
                <div :class="getDiffClasses(results.mat2, referenceResults.mat2, true, true)" class="whitespace-nowrap inline-flex items-center text-xs">
                  <component :is="getDiffIcon(results.mat2, referenceResults.mat2)" size="11" class="mr-0.5 flex-shrink-0" />
                  <span>{{ getDiffText(results.mat2, referenceResults.mat2) }}</span>
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <div 
                v-if="!isReferenceBuild && referenceResults?.mat2 && referenceResults?.avgTime && results.mat2 && results.avgTime"
                class="flex items-center"
              >
                <div :class="getDiffClasses(
                  calculatePerDay(results.mat2, results.avgTime), 
                  calculatePerDay(referenceResults.mat2, referenceResults.avgTime), 
                  true, 
                  true
                )" class="whitespace-nowrap inline-flex items-center text-xs">
                  <component :is="getDiffIcon(
                    calculatePerDay(results.mat2, results.avgTime), 
                    calculatePerDay(referenceResults.mat2, referenceResults.avgTime)
                  )" size="11" class="mr-0.5 flex-shrink-0" />
                  <span>{{ getDiffText(
                    calculatePerDay(results.mat2, results.avgTime), 
                    calculatePerDay(referenceResults.mat2, referenceResults.avgTime)
                  ) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="resource-values">
            <div class="flex flex-col">
              <span class="value text-orange-300">{{ formatNumber(results.mat2) }}</span>
              <span class="unit">per run</span>
            </div>
            <div class="flex flex-col">
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
          <div class="grid grid-cols-3 mb-1.5">
            <span class="resource-label self-center">{{ resultLabels.mat3 }}</span>
            <div class="flex justify-center">
              <div 
                v-if="!isReferenceBuild && referenceResults?.mat3 && results.mat3"
                class="flex items-center mr-15"
              >
                <div :class="getDiffClasses(results.mat3, referenceResults.mat3, true, true)" class="whitespace-nowrap inline-flex items-center text-xs">
                  <component :is="getDiffIcon(results.mat3, referenceResults.mat3)" size="11" class="mr-0.5 flex-shrink-0" />
                  <span>{{ getDiffText(results.mat3, referenceResults.mat3) }}</span>
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <div 
                v-if="!isReferenceBuild && referenceResults?.mat3 && referenceResults?.avgTime && results.mat3 && results.avgTime"
                class="flex items-center"
              >
                <div :class="getDiffClasses(
                  calculatePerDay(results.mat3, results.avgTime), 
                  calculatePerDay(referenceResults.mat3, referenceResults.avgTime), 
                  true, 
                  true
                )" class="whitespace-nowrap inline-flex items-center text-xs">
                  <component :is="getDiffIcon(
                    calculatePerDay(results.mat3, results.avgTime), 
                    calculatePerDay(referenceResults.mat3, referenceResults.avgTime)
                  )" size="11" class="mr-0.5 flex-shrink-0" />
                  <span>{{ getDiffText(
                    calculatePerDay(results.mat3, results.avgTime), 
                    calculatePerDay(referenceResults.mat3, referenceResults.avgTime)
                  ) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="resource-values">
            <div class="flex flex-col">
              <span class="value text-amber-300">{{ formatNumber(results.mat3) }}</span>
              <span class="unit">per run</span>
            </div>
            <div class="flex flex-col">
              <span class="value text-amber-300">{{ formatNumber(calculatePerDay(results.mat3, results.avgTime)) }}</span>
              <span class="unit">per day</span>
            </div>
          </div>
        </div>
      </div>
      <!-- XP-Karte -->
      <div class="resource-card border-blue-600/30">
        <div class="resource-icon bg-blue-900/20">
          <IconBrightness :size="18" class="text-blue-300" />
        </div>
        <div class="resource-content">
          <div class="grid grid-cols-3 mb-1.5">
            <span class="resource-label self-center">{{ resultLabels.xp }}</span>
            <div class="flex justify-center">
              <div 
                v-if="!isReferenceBuild && referenceResults?.xp && results.xp"
                class="flex items-center mr-15"
              >
                <div :class="getDiffClasses(results.xp, referenceResults.xp, true, true)" class="whitespace-nowrap inline-flex items-center text-xs">
                  <component :is="getDiffIcon(results.xp, referenceResults.xp)" size="11" class="mr-0.5 flex-shrink-0" />
                  <span>{{ getDiffText(results.xp, referenceResults.xp) }}</span>
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <div 
                v-if="!isReferenceBuild && referenceResults?.xp && referenceResults?.avgTime && results.xp && results.avgTime"
                class="flex items-center"
              >
                <div :class="getDiffClasses(
                  calculatePerDay(results.xp, results.avgTime), 
                  calculatePerDay(referenceResults.xp, referenceResults.avgTime), 
                  true, 
                  true
                )" class="whitespace-nowrap inline-flex items-center text-xs">
                  <component :is="getDiffIcon(
                    calculatePerDay(results.xp, results.avgTime), 
                    calculatePerDay(referenceResults.xp, referenceResults.avgTime)
                  )" size="11" class="mr-0.5 flex-shrink-0" />
                  <span>{{ getDiffText(
                    calculatePerDay(results.xp, results.avgTime), 
                    calculatePerDay(referenceResults.xp, referenceResults.avgTime)
                  ) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="resource-values">
            <div class="flex flex-col">
              <span class="value text-blue-300">{{ formatNumber(results.xp) }}</span>
              <span class="unit">per run</span>
            </div>
            <div class="flex flex-col">
              <span class="value text-blue-300">{{ formatNumber(calculatePerDay(results.xp, results.avgTime)) }}</span>
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
} from '../../utils/BuildComparisonUtils';

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
  width: 100%;
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
  margin-top: 0.125rem;
}

/* Responsive */
@media (max-width: 300px) {
  .resource-values {
    grid-template-columns: 1fr;
    gap: 0.375rem;
  }
}
</style>