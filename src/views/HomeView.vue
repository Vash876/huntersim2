<script setup>
const changelog = 
[
  {
    version: '2.0.2',
    date: '2025-03-15',
    baseVersion: 'Kylenator\'s Sheet v1.2.4',
    changes: [
      'Reorganized loot display for better readability',
      'Added new statistics tab for Hunter Stats',
      'Added validation check for invalid builds in build creator',
      'Fixed build name edit button functionality',
      'Added overrides display in build header',
      'Slightly optimized spacing on Horizontal View for better readability'
    ]
  },
  {
    version: '2.0.1',
    date: '2025-03-12',
    baseVersion: 'Kylenator\'s Sheet v1.2.4',
    changes: [
      'Added "per day" difference values with UI layout improvements',
      'Enhanced mobile build creator with two talents/attributes per row',
      'Added confirmation dialog when clicking outside build creator',
      'Implemented wider scrollbar for windows users who don\'t have a mouse wheel',
      'Fixed build import/export handling of zero values in overrides',
      'Fixed Ozzy Damage Reduction cost calculation'
    ]
  },
  {
    version: '2.0.0',
    date: '2025-03-11',
    baseVersion: 'Kylenator\'s Sheet v1.2.4',
    changes: [
      'Complete redesign of the application with modern UI',
      'Added a stage distribution chart',
      'Added Costs for Stats, Relics and Gadgets',
      'Improved build management with archiving',
      'New backup/restore system for all player data',
      'Added Cache Management for faster loading',
    ]
  },
  {
    version: '1.0.2',
    date: '2024-02-25', 
    baseVersion: 'Kylenator\'s Sheet v1.2.3',
    changes: [
      'Fixed Research#81 parameter not being passed correctly for Knox'
    ]
  },
  {
    version: '1.0.1',
    date: '2024-02-24',
    baseVersion: 'Kylenator\'s Sheet v1.2.3',
    changes: [
      'Updated to latest sheet version (1.2.3)',
      'Fixed default parameters being passed incorrectly for Borge and Ozzy',
      'Fixed relics and inscryptions not loading from shared builds',
      'Fixed incorrect gem values in build codes',
      'Fixed max Level for DR (Borge) and Evade (Ozzy)',
    ]
  },
  {
    version: '1.0',
    date: '2024-02-22',
    baseVersion: 'Kylenator\'s Sheet v1.2.1',
    changes: [
      'Support for Knox, Borge and Ozzy builds',
      'Share builds via URL',
      'Build Code compatible with Feii\'s Sim',
      'Percentage Differences for Results',
      'Improved Performance',
    ]
  },
];
</script>

<template>
  <main class="p-4">
    <h1 class="text-3xl font-bold mb-6 text-white">Changelog</h1>
    
    <div class="space-y-8">
      <div v-for="release in changelog" :key="release.version" class="bg-gray-800 p-4 rounded-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-white">Version {{ release.version }}</h2>
          <span class="text-gray-400">{{ release.date }}</span>
        </div>
        <p class="text-gray-400 mb-4">Based on {{ release.baseVersion }}</p>
        <ul class="list-disc list-inside space-y-2">
          <li v-for="change in release.changes" :key="change" class="text-gray-200">
            {{ change }}
          </li> 
        </ul>
      </div>
    </div>
  </main>
</template>