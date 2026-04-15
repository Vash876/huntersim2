<template>
  <div class="flex items-end justify-center py-16 select-none overflow-hidden">
    <div class="relative w-80 h-44">
      <!-- Sonne -->
      <div class="absolute top-0 right-8 animate-pulse" style="animation-duration: 4s">
        <IconSunHigh size="40" class="text-yellow-600/25" />
      </div>
      <!-- Wind -->
      <div class="absolute top-6 left-4 desert-drift">
        <IconWind size="22" class="text-gray-600/20" />
      </div>
      <div class="absolute top-10 right-20 desert-drift-slow">
        <IconWind size="16" class="text-gray-600/15" />
      </div>
      <!-- Kaktus links -->
      <div class="absolute bottom-6 left-10">
        <IconCactus size="52" class="text-green-800/30" />
      </div>
      <!-- Skull Mitte -->
      <div class="absolute bottom-5 left-1/2 -translate-x-1/2">
        <IconSkull size="28" class="text-gray-600/25 rotate-12" />
      </div>
      <!-- Kaktus rechts (kleiner) -->
      <div class="absolute bottom-6 right-14">
        <IconCactus size="36" class="text-green-800/25 -scale-x-100" />
      </div>
      <!-- Tumbleweed -->
      <div class="absolute bottom-4 left-0 tumbleweed-roll">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#92400e" stroke-width="1.2" opacity="0.5" />
          <ellipse cx="12" cy="12" rx="9" ry="5" stroke="#92400e" stroke-width="0.8" opacity="0.4" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="8" ry="4.5" stroke="#92400e" stroke-width="0.8" opacity="0.4" transform="rotate(-25 12 12)" />
          <path d="M5 9 Q9 14 19 10" stroke="#92400e" stroke-width="0.8" opacity="0.45" />
          <path d="M7 17 Q12 7 18 16" stroke="#92400e" stroke-width="0.8" opacity="0.45" />
          <path d="M4 13 Q12 9 20 13" stroke="#92400e" stroke-width="0.7" opacity="0.35" />
          <path d="M10 3 Q11 12 14 21" stroke="#92400e" stroke-width="0.7" opacity="0.35" />
        </svg>
      </div>
      <!-- Boden-Linie -->
      <div class="absolute bottom-3 inset-x-0 border-t border-dashed border-gray-700/30"></div>
    </div>
  </div>
</template>

<script setup>
import { IconCactus, IconSunHigh, IconWind, IconSkull } from '@tabler/icons-vue';
</script>

<style scoped>
.tumbleweed-roll {
  animation: tumbleweed 12s linear infinite;
}
@keyframes tumbleweed {
  0% { transform: translateX(-30px) rotate(0deg); opacity: 0; }
  5% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(320px) rotate(720deg); opacity: 0; }
}

.desert-drift {
  animation: drift 6s ease-in-out infinite;
}
.desert-drift-slow {
  animation: drift 9s ease-in-out infinite reverse;
}
@keyframes drift {
  0%, 100% { transform: translateX(0); opacity: 0.15; }
  50% { transform: translateX(16px); opacity: 0.3; }
}
</style>
