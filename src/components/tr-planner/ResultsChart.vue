<template>
  <div>
    <div v-if="shorts.length === 0" class="text-center text-gray-500 py-8">
      Keine Daten vorhanden. Füge zuerst einige Shorts hinzu.
    </div>
    
    <div v-else>
      <!-- Orb-Verlauf Diagramm -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-4">Orb-Entwicklung</h3>
        <div class="relative h-64 w-full">
          <!-- Y-Achse Labels -->
          <div class="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
            <div v-for="(label, index) in yAxisLabels" :key="index" class="text-right pr-2">
              {{ label }}
            </div>
          </div>
          
          <!-- Chart Area -->
          <div class="absolute left-16 right-0 top-0 bottom-0 bg-gray-800/50 border border-gray-700 rounded">
            <!-- Orbs Required Line -->
            <div
              v-for="(point, index) in chartPoints"
              :key="`req-${index}`"
              class="absolute w-1 bg-red-500/60"
              :style="{
                height: `${getHeightPercentage(point.orbsRequired)}%`,
                left: `${getXPosition(index)}%`,
                bottom: '0',
              }"
            ></div>
            
            <!-- Orbs Gained Bars -->
            <div
              v-for="(point, index) in chartPoints"
              :key="`gain-${index}`"
              class="absolute w-4 rounded-t"
              :class="point.orbsGained >= point.orbsRequired ? 'bg-green-500/70' : 'bg-blue-500/70'"
              :style="{
                height: `${getHeightPercentage(point.orbsGained)}%`,
                left: `${getXPosition(index) - 1}%`,
                bottom: '0',
              }"
            ></div>
            
            <!-- X-Axis Labels -->
            <div class="absolute bottom-0 left-0 right-0 flex justify-between px-2">
              <div
                v-for="(point, index) in chartPoints"
                :key="`label-${index}`"
                class="text-xs text-gray-500 transform -translate-x-1/2"
                :style="{
                  left: `${getXPosition(index)}%`,
                  bottom: '-20px',
                }"
              >
                {{ index + 1 }}
              </div>
            </div>
            
            <!-- Grid Lines -->
            <div
              v-for="i in 5"
              :key="`grid-${i}`"
              class="absolute left-0 right-0 border-t border-gray-700/50"
              :style="{
                bottom: `${i * 20}%`,
              }"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- Legende -->
      <div class="flex justify-center gap-6 text-sm">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-blue-500/70 rounded mr-2"></div>
          <span>Gesammelte Orbs</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-red-500/60 mr-2"></div>
          <span>Benötigte Orbs</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-green-500/70 rounded mr-2"></div>
          <span>Ziel erreicht</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  shorts: {
    type: Array,
    required: true
  }
});

// Daten für das Diagramm vorbereiten
const chartPoints = computed(() => {
  return props.shorts.map(short => ({
    orbsGained: short.orbsGained || 0,
    orbsRequired: short.orbsRequired || 0,
    totalOrbs: short.totalOrbs || 0
  }));
});

// Maximaler Wert für die Y-Achse bestimmen
const maxValue = computed(() => {
  if (props.shorts.length === 0) return 1000;
  
  const maxOrbsGained = Math.max(...props.shorts.map(s => s.orbsGained || 0));
  const maxOrbsRequired = Math.max(...props.shorts.map(s => s.orbsRequired || 0));
  const max = Math.max(maxOrbsGained, maxOrbsRequired);
  
  // Runde auf nächste "schöne" Zahl für die Skala
  return Math.ceil(max / 1000) * 1000;
});

// Y-Achsen-Beschriftungen generieren
const yAxisLabels = computed(() => {
  const max = maxValue.value;
  const labels = [];
  
  for (let i = 0; i <= 5; i++) {
    const value = (max / 5) * i;
    labels.unshift(formatNumber(value)); // Reihenfolge umkehren, damit größte Zahl oben steht
  }
  
  return labels;
});

// Berechne die prozentuale Höhe basierend auf dem Wert
function getHeightPercentage(value) {
  if (!value || maxValue.value === 0) return 0;
  return (value / maxValue.value) * 100;
}

// Berechne die X-Position für jeden Datenpunkt
function getXPosition(index) {
  if (props.shorts.length <= 1) return 50;
  
  // Gleichmäßige Verteilung über die gesamte Breite
  const step = 100 / (props.shorts.length - 1);
  return index * step;
}

// Formatiere große Zahlen lesbarer
function formatNumber(number) {
  if (number >= 1e9) return (number / 1e9).toFixed(1) + 'B';
  if (number >= 1e6) return (number / 1e6).toFixed(1) + 'M';
  if (number >= 1e3) return (number / 1e3).toFixed(1) + 'K';
  return number.toFixed(0);
}
</script>