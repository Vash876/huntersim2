<!-- Moderne Tailwind CSS Optimierungen für HunterSim2 -->

<template>
  <!-- 1. MODERNE BUTTON PATTERNS -->
  <!-- Alte Art -->
  <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
    Old Button
  </button>

  <!-- Neue Art: Mit focus-visible und motion-safe -->
  <button class="
    bg-blue-500 hover:bg-blue-600 
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
    active:scale-95 motion-safe:transition-all motion-safe:duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
    text-white px-4 py-2 rounded-lg
  ">
    Modern Button
  </button>

  <!-- 2. INTELLIGENT HUNTER CARDS -->
  <!-- Mit has() und group Patterns -->
  <div class="group hunter-card">
    <img class="hunter-avatar group-has-[input:checked]:ring-2 group-has-[input:checked]:ring-blue-500" />
    <input type="radio" class="sr-only" />
    <div class="hunter-name group-hover:text-blue-400 transition-colors">Borge</div>
    <div class="hunter-stats opacity-0 group-hover:opacity-100 transition-opacity">
      <!-- Stats nur bei Hover sichtbar -->
    </div>
  </div>

  <!-- 3. MOBILE-FIRST MODAL PATTERN -->
  <div class="
    fixed inset-0 z-50 
    bg-gray-900/80 backdrop-blur-sm
    flex items-end sm:items-center justify-center 
    p-4 pb-[--mobile-safe-bottom] sm:pb-4
  ">
    <div class="
      bg-gray-800 
      w-full sm:w-auto sm:min-w-96 sm:max-w-2xl
      rounded-t-xl sm:rounded-xl
      animate-slide-up
      max-h-[80vh] overflow-y-auto
    ">
      <!-- Modal Content -->
    </div>
  </div>

  <!-- 4. PROGRESSIVE ENHANCEMENT PATTERNS -->
  <!-- Unterstützt sowohl Maus als auch Touch -->
  <div class="
    build-item
    hover:bg-gray-700 
    pointer-coarse:hover:bg-transparent pointer-coarse:active:bg-gray-700
    transition-colors
    cursor-pointer pointer-coarse:cursor-default
  ">
    <!-- Touch-friendly auf mobilen Geräten -->
  </div>

  <!-- 5. INTELLIGENTE FORM PATTERNS -->
  <form class="space-y-4">
    <div class="form-group">
      <label class="peer-invalid:text-red-500 peer-valid:text-green-500">
        Gem Level
      </label>
      <input 
        type="number" 
        class="
          peer
          w-full p-3 rounded-lg
          bg-gray-800 border border-gray-600
          invalid:border-red-500 invalid:ring-1 invalid:ring-red-500
          valid:border-green-500 valid:ring-1 valid:ring-green-500
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50
          transition-all
        "
        min="0" 
        max="999" 
        required 
      />
      <div class="hidden peer-invalid:block text-red-500 text-sm mt-1">
        Please enter a valid gem level (0-999)
      </div>
    </div>
  </form>

  <!-- 6. MODERN LOADING STATES -->
  <div class="loading-skeleton">
    <!-- Bessere als spinner - skeleton screens -->
    <div class="animate-pulse space-y-4">
      <div class="h-4 bg-gray-700 rounded w-3/4"></div>
      <div class="h-4 bg-gray-700 rounded w-1/2"></div>
      <div class="h-32 bg-gray-700 rounded"></div>
    </div>
  </div>

  <!-- 7. ADVANCED GRID PATTERNS -->
  <!-- Statt fester Spalten: auto-fit -->
  <div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
    <!-- Passt sich automatisch an verfügbaren Platz an -->
  </div>

  <!-- 8. TOOLTIP MIT MODERN CSS -->
  <button 
    data-tooltip="Hunter builds comparison"
    class="
      relative
      before:content-[attr(data-tooltip)]
      before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2
      before:mb-2 before:px-2 before:py-1
      before:bg-gray-900 before:text-white before:text-sm before:rounded
      before:opacity-0 before:pointer-events-none
      hover:before:opacity-100
      before:transition-opacity
    "
  >
    Compare
  </button>

  <!-- 9. SMART SPACE PATTERNS -->
  <!-- Statt fester margins: space-between mit gap -->
  <div class="flex items-center justify-between gap-4">
    <!-- Automatischer Abstand auch bei wrapping -->
  </div>

  <!-- 10. MODERN COLOR PATTERNS -->
  <!-- Mit oklch() Farben (falls Tailwind v4) -->
  <div class="bg-[oklch(0.63_0.24_25)] text-[oklch(0.9_0.05_25)]">
    <!-- Konsistente Helligkeit über alle Farbtöne -->
  </div>

</template>

<style>
/* Modern CSS Custom Properties für Konsistenz */
.hunter-card {
  --hunter-primary: theme('colors.blue.500');
  --hunter-hover: theme('colors.blue.600');
  
  transition: all 0.2s ease;
}

/* Gaming-spezifische Animationen */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

/* Focus Management für Gaming UI */
.hunter-card:focus-within {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 2px;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High Contrast Support */
@media (prefers-contrast: more) {
  .hunter-card {
    border: 2px solid currentColor;
  }
}

/* Print Styles */
@media print {
  .hunter-card {
    break-inside: avoid;
    border: 1px solid #000;
  }
}
</style>
