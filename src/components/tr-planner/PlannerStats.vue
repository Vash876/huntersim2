<template>
  <div>
    <!-- Statistik-Zusammenfassung -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <!-- Gesamtsumme Orbs -->
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="text-sm text-gray-400">Gesamte Orbs</div>
        <div class="text-2xl font-bold mt-1">{{ formatNumber(stats.totalOrbs) }}</div>
      </div>
      
      <!-- Gesamtsumme Fragments -->
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="text-sm text-gray-400">Campaign Fragments</div>
        <div class="text-2xl font-bold mt-1">{{ formatNumber(stats.totalFrags) }}</div>
      </div>
      
      <!-- Status der Shorts -->
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="text-sm text-gray-400">Status</div>
        <div class="flex items-center mt-1">
          <div class="text-2xl font-bold mr-2">{{ stats.readyShorts }}/{{ shorts.length }}</div>
          <div class="text-sm text-green-400">Shorts erfüllt</div>
        </div>
      </div>
      
      <!-- Geschätzte Endzeit -->
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="text-sm text-gray-400">Voraussichtliches Ende</div>
        <div class="text-2xl font-bold mt-1">{{ formatDate(stats.estimatedCompletionDate) }}</div>
      </div>
    </div>
    
    <!-- Erweiterte Statistiken -->
    <div class="space-y-6">
      <!-- TR Info -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-medium mb-3">TR Details</h3>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-sm text-gray-400">Durchschnittliche Orbs pro TR</div>
            <div class="text-xl font-bold mt-1">{{ formatNumber(averageOrbsPerTR) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400">Durchschnittliche Dauer</div>
            <div class="text-xl font-bold mt-1">{{ averageDuration }} h</div>
          </div>
          <div>
            <div class="text-sm text-gray-400">Orbs pro Stunde</div>
            <div class="text-xl font-bold mt-1">{{ formatNumber(orbsPerHour) }}</div>
          </div>
        </div>
      </div>
      
      <!-- Übersicht der nächsten Shorts -->
      <div v-if="pendingShorts.length > 0" class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-medium mb-3">Nächste Shorts</h3>
        <div class="space-y-2">
          <div
            v-for="(short, index) in pendingShorts.slice(0, 3)"
            :key="`pending-${index}`"
            class="grid grid-cols-4 gap-2 py-2 border-b border-gray-700 text-sm"
          >
            <div>#{{ findShortIndex(short) + 1 }}</div>
            <div>{{ formatDate(short.startDate) }}</div>
            <div class="text-right">{{ formatNumber(short.orbsGained) }}</div>
            <div class="text-right text-red-400">
              {{ formatNumber(Math.max(0, short.orbsRequired - short.orbsGained)) }} fehlend
            </div>
          </div>
        </div>
      </div>
      
      <!-- Gesamtübersicht -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-medium mb-3">Gesamtzeitraum</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-400">Startdatum</div>
            <div class="text-lg font-bold mt-1">{{ formatDate(startDate) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400">Enddatum</div>
            <div class="text-lg font-bold mt-1">{{ formatDate(stats.estimatedCompletionDate) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400">Gesamtdauer</div>
            <div class="text-lg font-bold mt-1">{{ totalDurationInDays }} Tage</div>
          </div>
          <div>
            <div class="text-sm text-gray-400">Ø Orbs pro Tag</div>
            <div class="text-lg font-bold mt-1">{{ formatNumber(orbsPerDay) }}</div>
          </div>
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
  },
  config: {
    type: Object,
    required: true
  },
  stats: {
    type: Object,
    required: true
  }
});

// Ausstehende Shorts (noch nicht erfüllt)
const pendingShorts = computed(() => {
  return props.shorts.filter(short => short.orbsGained < short.orbsRequired);
});

// Index eines Shorts im Gesamtarray finden
function findShortIndex(shortToFind) {
  return props.shorts.findIndex(s => s.id === shortToFind.id);
}

// Durchschnittliche Orbs pro TR
const averageOrbsPerTR = computed(() => {
  if (props.shorts.length === 0) return 0;
  const totalOrbs = props.shorts.reduce((sum, short) => sum + (short.orbsGained || 0), 0);
  return totalOrbs / props.shorts.length;
});

// Durchschnittliche Dauer eines TR
const averageDuration = computed(() => {
  if (props.shorts.length === 0) return 0;
  const totalHours = props.shorts.reduce((sum, short) => sum + (short.duration || 0), 0);
  return (totalHours / props.shorts.length).toFixed(1);
});

// Orbs pro Stunde
const orbsPerHour = computed(() => {
  if (props.shorts.length === 0) return 0;
  const totalOrbs = props.shorts.reduce((sum, short) => sum + (short.orbsGained || 0), 0);
  const totalHours = props.shorts.reduce((sum, short) => sum + (short.duration || 0), 0);
  return totalHours > 0 ? totalOrbs / totalHours : 0;
});

// Startdatum des ersten TR
const startDate = computed(() => {
  if (props.shorts.length === 0) return null;
  return new Date(props.shorts[0].startDate);
});

// Gesamtdauer in Tagen
const totalDurationInDays = computed(() => {
  if (!startDate.value || !props.stats.estimatedCompletionDate) return 0;
  
  const diffTime = Math.abs(props.stats.estimatedCompletionDate - startDate.value);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Millisekunden in Tage umrechnen
});

// Orbs pro Tag
const orbsPerDay = computed(() => {
  if (totalDurationInDays.value === 0) return 0;
  return props.stats.totalOrbs / totalDurationInDays.value;
});

// Große Zahlen formatieren
function formatNumber(number) {
  if (!number) return '0';
  
  if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
  if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
  if (number >= 1e3) return (number / 1e3).toFixed(1) + 'K';
  return number.toFixed(0);
}

// Datum formatieren
function formatDate(date) {
  if (!date) return '-';
  
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
</script>