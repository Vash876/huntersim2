<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/upgrades/UpgradeGrid.vue -->
<template>
  <div>
    <!-- Lade-Indikator -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <!-- Upgrade-Grid mit dynamischer Spalten-Konfiguration -->
    <div 
      v-else 
      class="grid gap-6"
      :class="{
        'grid-cols-1': true,
        'md:grid-cols-2': columns >= 2,
        'lg:grid-cols-3': columns >= 3,
        'xl:grid-cols-4': columns >= 4
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Number,
    default: 3 // Standard 3 Spalten (1 auf kleinen, 2 auf mittleren, 3 auf großen Bildschirmen)
  }
});
</script>