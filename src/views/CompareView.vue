<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Build-Vergleich</h1>
    <div class="bg-slate-800 p-6 rounded-lg shadow-lg">
      <p class="mb-4">Hier kannst du verschiedene Builds miteinander vergleichen.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 bg-slate-700 rounded-md">
          <h2 class="text-xl font-bold mb-2">Build 1</h2>
          <select class="bg-slate-600 w-full p-2 rounded">
            <option>Build auswählen...</option>
          </select>
          <div class="mt-4 p-3 bg-slate-800 rounded">
            <p>Keine Daten verfügbar</p>
          </div>
        </div>
        <div class="p-4 bg-slate-700 rounded-md">
          <h2 class="text-xl font-bold mb-2">Build 2</h2>
          <select class="bg-slate-600 w-full p-2 rounded">
            <option>Build auswählen...</option>
          </select>
          <div class="mt-4 p-3 bg-slate-800 rounded">
            <p>Keine Daten verfügbar</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>