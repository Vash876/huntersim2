<!-- Beispiel: Moderne Container Query Patterns für Ihre Komponenten -->

<template>
  <!-- Alte Art: Viewport-basiert -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Cards... -->
  </div>

  <!-- Neue Art: Container Query-basiert -->
  <div class="@container">
    <div class="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">
      <!-- Cards passen sich an Container an, nicht Viewport -->
    </div>
  </div>

  <!-- Hunter Build Cards mit Container Queries -->
  <div class="@container">
    <div class="build-card @sm:build-card-horizontal @lg:build-card-detailed">
      <!-- Build content -->
    </div>
  </div>

  <!-- Modal mit intelligenter Größenanpassung -->
  <div class="@container/modal">
    <div class="modal-content @sm/modal:w-96 @md/modal:w-[32rem] @lg/modal:w-[40rem]">
      <!-- Modal content -->
    </div>
  </div>
</template>

<style>
/* Container Query Classes für Ihre App */
.@container {
  container-type: inline-size;
}

.@container\/modal {
  container-type: inline-size;
  container-name: modal;
}

/* Build Card Variants */
.build-card {
  @apply bg-gray-800/30 p-4 rounded-lg border;
}

.build-card-horizontal {
  @apply flex items-center space-x-4;
}

.build-card-detailed {
  @apply p-6;
}

/* Responsive Hunter Navigation */
@container (min-width: 24rem) {
  .hunter-nav {
    @apply flex-row;
  }
}

@container (min-width: 32rem) {
  .hunter-nav {
    @apply space-x-4;
  }
}
</style>
