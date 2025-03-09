<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Import/Export</h1>
    <div class="bg-slate-800 p-6 rounded-lg shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 bg-slate-700 rounded-md">
          <h2 class="text-xl font-bold mb-2">Import Build</h2>
          <p class="mb-4">Füge hier den Build-Code ein:</p>
          <textarea 
            class="w-full p-3 bg-slate-600 rounded resize-none min-h-[120px]" 
            placeholder="Build-Code hier einfügen..."></textarea>
          <button class="mt-3 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Importieren
          </button>
        </div>
        <div class="p-4 bg-slate-700 rounded-md">
          <h2 class="text-xl font-bold mb-2">Export Build</h2>
          <p class="mb-4">Wähle einen Build zum Exportieren:</p>
          <select class="bg-slate-600 w-full p-2 rounded mb-4">
            <option>Build auswählen...</option>
          </select>
          <div class="p-3 bg-slate-600 rounded min-h-[80px]">
            <p class="text-gray-400">Build-Code wird hier angezeigt</p>
          </div>
          <button class="mt-3 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Kopieren
          </button>
        </div>
      </div>
    </div>
  </div>
</template>