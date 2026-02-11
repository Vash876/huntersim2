<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/upgrades/UpgradeGrid.vue -->
<template>
  <div>
    <!-- Lade-Indikator -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="upgrade-grid-loader">
        <div class="upgrade-grid-loader__dot"></div>
        <div class="upgrade-grid-loader__dot"></div>
        <div class="upgrade-grid-loader__dot"></div>
      </div>
    </div>

    <!-- Upgrade-Grid mit dynamischer Spalten-Konfiguration -->
    <div 
      v-else 
      class="upgrade-grid grid gap-4 sm:gap-5"
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
    default: 3
  }
});
</script>

<style scoped>
/* Staggered appear animation for grid children */
.upgrade-grid > :deep(*) {
  animation: upgradeCardAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

.upgrade-grid > :deep(*:nth-child(1)) { animation-delay: 0.02s; }
.upgrade-grid > :deep(*:nth-child(2)) { animation-delay: 0.05s; }
.upgrade-grid > :deep(*:nth-child(3)) { animation-delay: 0.08s; }
.upgrade-grid > :deep(*:nth-child(4)) { animation-delay: 0.11s; }
.upgrade-grid > :deep(*:nth-child(5)) { animation-delay: 0.14s; }
.upgrade-grid > :deep(*:nth-child(6)) { animation-delay: 0.17s; }
.upgrade-grid > :deep(*:nth-child(7)) { animation-delay: 0.20s; }
.upgrade-grid > :deep(*:nth-child(8)) { animation-delay: 0.23s; }
.upgrade-grid > :deep(*:nth-child(9)) { animation-delay: 0.26s; }
.upgrade-grid > :deep(*:nth-child(10)) { animation-delay: 0.29s; }
.upgrade-grid > :deep(*:nth-child(11)) { animation-delay: 0.32s; }
.upgrade-grid > :deep(*:nth-child(12)) { animation-delay: 0.35s; }
.upgrade-grid > :deep(*:nth-child(n+13)) { animation-delay: 0.38s; }

@keyframes upgradeCardAppear {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Loader */
.upgrade-grid-loader {
  display: flex;
  gap: 0.6rem;
}

.upgrade-grid-loader__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.6);
  animation: loaderBounce 1.4s infinite ease-in-out both;
}

.upgrade-grid-loader__dot:nth-child(1) { animation-delay: -0.32s; }
.upgrade-grid-loader__dot:nth-child(2) { animation-delay: -0.16s; }
.upgrade-grid-loader__dot:nth-child(3) { animation-delay: 0s; }

@keyframes loaderBounce {
  0%, 80%, 100% {
    transform: scale(0.4);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>