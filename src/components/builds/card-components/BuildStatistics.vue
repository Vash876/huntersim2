<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/builds/card-components/BuildStatistics.vue -->
<template>
  <div class="stats-container">
    <!-- Hauptstatistik: Loot per Minute -->
    <div class="main-stat-card">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center">
          <IconReportMoney :size="18" class="mr-1.5" :class="`text-${hunterColor}-400`" />
          <span class="text-sm font-medium text-gray-200">{{ resultLabels.lootPerMin }}</span>
        </div>
        <div 
          v-if="!props.isReferenceBuild && props.referenceResults?.lootPerMin && results.lootPerMin"
          class="comparison-chip"
          :class="getDiffBadgeClass(results.lootPerMin, props.referenceResults.lootPerMin, true)"
        >
          <component :is="getDiffIcon(results.lootPerMin, props.referenceResults.lootPerMin, true)" :size="14" />
          <span class="ml-0.5">{{ getDiffText(results.lootPerMin, props.referenceResults.lootPerMin, true) }}</span>
        </div>
      </div>
      
      <div class="mb-1.5">
        <span class="primary-value" :class="`text-${hunterColor}-400`">{{ formatNumber(results.lootPerMin) }}</span>
      </div>
      
      <div class="progress-track">
        <div class="progress-bg"></div>
        <div 
          class="progress-fill" 
          :class="`bg-${hunterColor}-500`"
          :style="{ width: getProgressWidth(results.lootPerMin, props.referenceResults?.lootPerMin) }"
        ></div>
      </div>
    </div>
    
    <!-- Grid für wichtigsten Spielstatistiken -->
    <div class="stats-grid">
      <!-- Durchschnittliche Stage -->
      <div class="stat-card">
        <div class="stat-header">
          <IconStairs :size="16" :class="`text-${hunterColor}-400`" />
          <span class="stat-title">{{ resultLabels.avgStage }}</span>
          <div 
            v-if="!props.isReferenceBuild && props.referenceResults?.avgStage" 
            class="stat-diff"
            :class="getAbsoluteDiffClass(results.avgStage, props.referenceResults.avgStage)"
          >
            {{ getAbsoluteDiffText(results.avgStage, props.referenceResults.avgStage) }}
          </div>
        </div>
        <div class="stat-value-row">
          <div class="stat-main-value">{{ formatStage(results.avgStage, true) }}</div>
          <div class="stat-range">{{ formatStage(results.minStage) }}-{{ formatStage(results.maxStage) }}</div>
        </div>
      </div>
      
      <!-- Laufzeit -->
      <div class="stat-card">
        <div class="stat-header">
          <IconClock :size="16" class="text-blue-400" />
          <span class="stat-title">{{ resultLabels.avgTime }}</span>
          <div 
            v-if="!props.isReferenceBuild && props.referenceResults?.avgTime" 
            class="stat-diff"
            :class="getTimeDiffClass(results.avgTime, props.referenceResults.avgTime)"
          >
            {{ getTimeDiffText(results.avgTime, props.referenceResults.avgTime) }}
          </div>
        </div>
        <div class="stat-value-row">
          <div class="stat-main-value">{{ formatTime(results.avgTime) }}</div>
        </div>
      </div>
      
      <!-- Runs pro Tag -->
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
  IconArrowUp, IconArrowDown, IconEqual 
} from '@tabler/icons-vue';
import { 
  formatNumber, formatStage, formatTime,
  calculateRunsPerDay
} from '../utils/BuildComparisonUtils';

const props = defineProps({
  results: { type: Object, required: true },
  referenceResults: { type: Object, default: () => ({}) },
  isReferenceBuild: { type: Boolean, default: false },
  hunterColor: { type: String, required: true },
  resultLabels: { type: Object, required: true }
});

// Berechnet den Fortschrittsbalken
function getProgressWidth(value, reference) {
  if (!reference || !value) return '85%'; // Standard-Wert wenn keine Referenz
  
  // Vergleiche mit Referenz, max 150% der Referenz
  const percentage = Math.min((value / reference) * 100, 150);
  return `${percentage}%`;
}

// Differenz-Funktionen
function getDiffIcon(value, reference, higherIsBetter = true) {
  if (!value || !reference) return IconEqual;
  
  const diff = value - reference;
  const percentDiff = (diff / reference) * 100;
  
  if (Math.abs(percentDiff) < 1) return IconEqual;
  if (percentDiff > 0) {
    return higherIsBetter ? IconArrowUp : IconArrowDown;
  } else {
    return higherIsBetter ? IconArrowDown : IconArrowUp;
  }
}

function getDiffText(value, reference) {
  if (!value || !reference) return '';
  
  const diff = value - reference;
  const percentDiff = (diff / reference) * 100;
  return Math.abs(percentDiff).toFixed(1) + '%';
}

function getAbsoluteDiffText(value, reference) {
  if (!value || !reference) return '';
  
  const diff = value - reference;
  return (diff >= 0 ? '+' : '') + diff.toFixed(1);
}

function getTimeDiffText(value, reference) {
  if (!value || !reference) return '';
  
  const diff = value - reference;
  return (diff >= 0 ? '+' : '') + Math.abs(diff).toFixed(1) + 'm';
}

// CSS-Klassen für Vergleiche
function getDiffBadgeClass(value, reference, higherIsBetter = true) {
  if (!value || !reference) return 'neutral';
  
  const diff = value - reference;
  const percentDiff = (diff / reference) * 100;
  
  if (Math.abs(percentDiff) < 1) return 'neutral';
  if (percentDiff > 0) {
    return higherIsBetter ? 'positive' : 'negative';
  } else {
    return higherIsBetter ? 'negative' : 'positive';
  }
}

function getAbsoluteDiffClass(value, reference, higherIsBetter = true) {
  if (!value || !reference) return '';
  
  const diff = value - reference;
  
  if (Math.abs(diff) < 0.1) return 'text-gray-400';
  if (diff > 0) {
    return higherIsBetter ? 'text-emerald-400' : 'text-red-400';
  } else {
    return higherIsBetter ? 'text-red-400' : 'text-emerald-400';
  }
}

function getTimeDiffClass(value, reference) {
  if (!value || !reference) return '';
  
  const diff = value - reference;
  
  if (Math.abs(diff) < 0.1) return 'text-gray-400';
  if (diff > 0) {
    return 'text-red-400';  // Höhere Zeit ist schlechter
  } else {
    return 'text-emerald-400';  // Niedrigere Zeit ist besser
  }
}
</script>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

/* Hauptstatistik-Karte */
.main-stat-card {
  background-color: rgba(17, 24, 39, 0.5);
  border-radius: 0.5rem;
  padding: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.primary-value {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.1;
}

.comparison-chip {
  display: flex;
  align-items: center;
  padding: 0.1875rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.comparison-chip.positive {
  background-color: rgba(16, 185, 129, 0.15);
  color: rgba(52, 211, 153, 1);
}

.comparison-chip.negative {
  background-color: rgba(239, 68, 68, 0.15);
  color: rgba(248, 113, 113, 1);
}

.comparison-chip.neutral {
  background-color: rgba(75, 85, 99, 0.15);
  color: rgba(156, 163, 175, 1);
}

.progress-track {
  position: relative;
  height: 0.375rem;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
}

.progress-bg {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(55, 65, 81, 0.3);
}

.progress-fill {
  position: absolute;
  height: 100%;
  transition: width 1s ease-in-out;
}

/* Statistik-Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.stat-card {
  background-color: rgba(31, 41, 55, 0.4);
  border-radius: 0.5rem;
  padding: 0.75rem;
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

.stat-diff {
  position: absolute;
  right: 0;
  font-size: 0.72rem;
  font-weight: 500;
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

/* Responsive Design - ANGEPASST */
@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Erzwingt, dass das dritte Element volle Breite hat */
  .stats-grid > .stat-card:nth-child(3) {
    grid-column: 1 / -1;
  }
}

/* Nur für sehr kleine Bildschirme alles untereinander */
@media (max-width: 360px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  /* Zurücksetzen der Spezialregel für das dritte Element */
  .stats-grid > .stat-card:nth-child(3) {
    grid-column: auto;
  }
}
</style>