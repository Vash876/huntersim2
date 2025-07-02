<script setup>
const changelog = 
[
  {
    version: '2.6.0',
    date: '2025-07-01',
    changes: [
      {
        text: '🎉 Major Rebrand: Hunter Simulator → CIFI Tools',
        subItems: [
          'Renamed application to <span class="text-purple-400 font-medium">CIFI Tools</span>',
          'Moved to new domain: <a href="https://cifi-tools.com" target="_blank" class="text-blue-400 hover:text-blue-300 transition-colors">https://cifi-tools.com</a>',
        ]
      },
      {
        text: '⚠️ Important: Data Migration Required',
        subItems: [
          '<b class="text-yellow-400">Please create a backup in Settings</b> on the old domain and import it on the new domain to transfer your builds and Tools data',
          '<b class="text-red-400">Issue:</b> TR Planner data is not included in backups due to compatibility issues with the previous version without Gem Overview',
          'TR Planner plans will need to be manually recreated - sorry for the inconvenience',
        ]
      }
    ]
  },
  {
    version: '2.5.4',
    date: '2025-06-30',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'Hunter Simulator',
        subItems: [
          'Added "Hide Maxed" toggle in Override Modal to filter out upgrades that are already at maximum level',
          'Added Descriptions for Inscryptions in Override Modal',
        ]
      },
    {
      text: 'Attraction GN#3 Calculator',
      subItems: [
        'AttrGN#3 Multi input supports larger numbers beyond 1e308',
      ]
    },
    {
      text: 'Loop Mod Overview',
      subItems: [
        'Added "All Time Highest MP" filter to hide permanent Loop Mods (Boons) and Ouroboros Crew you already own',
      ]
    }
    ]
  },
  {
    version: '2.5.3',
    date: '2025-06-16',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'Loop Mod Overview',
        subItems: [
          'Added "Requirements Updated?" feature to quickly identify newly affordable Loop Mods after progression',
        ]
      }
    ]
  },
  {
    version: '2.5.2',
    date: '2025-06-15',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'Hunter Simulator',
        subItems: [
          'Added Boss Kill Rate by Revive Count analysis showing how many revives are optimal for boss encounters (Ozzy)',
          'Added comprehensive Revive distribution analysis in the Build Statistics modal',
          '<b class="text-amber-500">Important:</b> Please re-evaluate your existing builds to access the new features. The best way to do this is to clear the cache in the Settings.'
        ]
      },
      {
        text: 'Gadget Calculator',
        subItems: [
          'Added original gadget assets for improved visual experience',
        ]
      }
    ]
  },
  {
    version: '2.5.1',
    date: '2025-06-12',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'Hunter Simulator',
        subItems: [
          'Fixed chart display bug where charts would sometimes not render properly',
        ]
      },
      {
        text: 'TR Planner',
        subItems: [
          'Added delete confirmation dialog for TR plans to prevent accidental deletions',
        ]
      }
    ]
  },
  {
    version: '2.5.0',
    date: '2025-06-09',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: '<b>MAJOR: WebAssembly Integration</b>',
        subItems: [
          '<b class="text-green-500">2-3x faster evaluations:</b> All Hunter evaluations now use WebAssembly (WASM) instead of JavaScript for significantly improved performance',
          'Maintained 100% accuracy - all calculations produce identical results to the previous JavaScript implementation',
        ]
      },
      {
        text: 'Attraction GN#3 Calculator Enhancements:',
        subItems: [
          'Added "Current Ticks in LR" input field to track progress in current Loop Reset',
          'Added "Pending Multiplier" calculation showing accumulated multiplier ready for next LR',
          'Added "Days in LR" display showing how long current Loop Reset has been running',
        ]
      }
    ]
  },
  {
    version: '2.4.2',
    date: '2025-06-08',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'TR Planner Enhancements:',
        subItems: [
          'Added Gem Overview with progression-friendly interface to prevent new players from being overwhelmed by the complexity of the late game or spoiled by seeing boosts they don\'t have access to yet',
          '<b class="text-red-500">Important:</b> Please configure your gem levels immediately in the Gem Overview to ensure accurate calculations - incorrect gem settings may lead to wrong results!',
          '<b class="text-red-500">Important:</b> Maxed Boosts is resetted - please set it to your current maxed boosts again to get accurate results',
        ]
      },
      {
        text: 'Loop Mod Overview:',
        subItems: [
          'Now directly connected to Farns\' Google Sheet for real-time Loop Mod data',
          'Loop Mod database automatically updates when the source sheet is modified',
          'Special thanks to Farns for maintaining the comprehensive Loop Mod database!'
        ]
      },
      {
        text: 'Gadget Calculator:',
        subItems: [
          'Slightly changed style for better usability',
          'Added Summary feature for sharing gadget upgrade plans'
        ]
      },
      {
        text: 'Hunter Simulator:',
        subItems: [
          'Added a "Hide Maxed" toggle in Inscryptions section to filter out maxed upgrades'
        ]
      },
      {
        text: 'Tools Section:',
        subItems: [
          'Added Attraction GN#3 Calculator'
        ]
      },
    ]
  },
  {
    version: '2.4.1',
    date: '2025-06-02',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'Hunter Simulator Updates:',
        subItems: [
          'Added new Creation 4 Gem Upgrades (Borge GU, Ozzy GU, Knox GU)',
          'Implemented cost calculation for the new Gem Upgrades',
          'Further Ozzy Boss 300 nerf adjustments',
        ]
      },
      {
        text: 'TR Planner:',
        subItems: [
          'Rolled back Research Points feature to previous version due to stability issues',
        ]
      }
    ]
  },
  {
    version: '2.4.0',
    date: '2025-06-01',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'NEW: Trait Sphere Planner:',
        subItems: [
          'Added comprehensive Trait Sphere planning tool for optimizing Antimatter Core usage (Credits to Solanaceae)',
          'Pre-built community strategy presets included (Thx for the help Caylris)',
        ]
      },
      {
        text: 'TR Planner Enhancements:',
        subItems: [
          'Added Research Multi-Select functionality for better planning',
          'Individual research levels can now be selected/deselected for precise optimization',
          'Added new Ultima Loop Mod: Rule of Consistency',
          'Added Cost Calculation for Loop Mods and Shards (Ultima Loop Mod: Rule of Consistency and m0)',
        ]
      },
      {
        text: 'Hunter Simulator Updates:',
        subItems: [
          'Applied Ozzy Boss 300 nerf adjustments to match current game balance',
          'Added a Re-Evaluate button to Hunter Simulator for quick recalculations',
        ]
      },
      {
        text: 'Loop Mod Overview Improvements:',
        subItems: [
          'Added some missing Loop Mods to the database for complete coverage',
          'Changed some tier classifications',
        ]
      },
      {
        text: 'UI Fixes:',
        subItems: [
          'Fixed additional hidden button issues for mobile users',
        ]
      }
    ]
  },
  {
    version: '2.3.6',
    date: '2025-05-18',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'Tools Section:',
        subItems: [
          'Added Loop Mod Overview: A comprehensive tool to browse and filter endgame Loop Mods (Credits to Farns)',
          'Loop Mods can be filtered by MP value with adjustable range to give you a quick overview of the Loop Mods you are going to get',
        ]
      },
      {
        text: 'Hunter Simulator:',
        subItems: [
          'Added new batch of Construction Milestones (#51)',
        ]
      },
      {
        text: 'TR Planner:',
        subItems: [
          'Added new batch of Construction Milestones (#49-#51)',
          'Added tooltips to TR Details showing improved boosts for each TR',
        ]
      },
      {
        text: 'UI Fix:',
        subItems: [
          'Fixed TR Planner buttons being partially hidden behind mobile navigation bar on smartphones',
        ]
      }
    ]
  },
  {
    version: '2.3.5',
    date: '2025-05-07',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'Upgrade Comparison Modal:',
        subItems: [
          'Added interactive Loot Collection Slider that shows remaining collection time based on your current resource progress',
          'Customize how much of a resource you\'ve already gathered to get more accurate time estimates'
        ]
      },
      {
        text: 'Tools Section:',
        subItems: [
          'Added Diamond Ultima Calculator (Credits to Lamaredia)',
          'Relocated Gadget Calculator to Tools section and added Multiplier calculation for each gadget',
        ]
      },
      {
        text: 'Navigation Improvements:',
        subItems: [
          'Slightly changed navigation bar on desktop',
          'Complete redesign on mobile with improved accessibility and modern interface'
        ]
      }
    ]
  },
  {
    version: '2.3.4',
    date: '2025-05-04',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'TR Planner:',
        subItems: [
          'Bug fix: Maxed boosts are now correctly hidden in the UI',
          'Fixed issue with boost dependencies not respecting maxed boosts from Maxed Boosts Modal'
        ]
      },
      {
        text: 'Upgrade Comparison Modal:',
        subItems: [
          'Added Fragment Income input field to calculate collection time for fragment-based upgrades',
          'Modal now automatically closes after applying build changes'
        ]
      },
      {
        text: 'Build Statistics:',
        subItems: [
          'Added tooltip to Loot Score'
        ]
      },
      {
        text: 'Override Modal:',
        subItems: [
          'Added cost calculation for Gem Upgrades'
        ]
      }
    ]
  },
  {
    version: '2.3.3',
    date: '2025-05-01',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'TR Planner:',
        subItems: [
          'Added tooltips for boosts with informative descriptions',
          'Implemented boost dependencies - required upgrades must be unlocked before dependent boosts can be adjusted',
          'Bug fix: TR Count and All-Time Orbs are now correctly preserved when copying plans'
        ]
      },
      {
      text: 'Settings Improvements:',
      subItems: [
        'Expanded Reset/Backup functionality to include TR Planner and Gadget Calculator data',
      ]
    }
    ]
  },
  {
    version: '2.3.2',
    date: '2025-04-22',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'UI Improvements:',
        subItems: [
          'Improved visual feedback when reaching maximum level of any upgrade',
        ]
      }
    ]
  },
  {
    version: '2.3.1',
    date: '2025-04-22',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'TR Planner enhancements:',
        subItems: [
          'Added start date display for each TR in detail view',
          'Automatically calculates TR start date based on Current Hours in TR when creating a plan via Orb Calculator',
          'Various bug fixes'
        ]
      }
    ]
  },
  {
    version: '2.3.0',
    date: '2025-04-20',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      {
        text: 'Added XP Progress visualization in Upgrade Comparison Modal:',
        subItems: [
          'Interactive slider to adjust your current XP progress',
          'Available in the new "XP" tab in any Upgrade Comparison Window',
          'Calculates time remaining based on your XP gains per day'
        ]
      },
      {
        text: 'Re-enabled Tools section:',
        subItems: [
          {
            text: 'TR Planner enhancements:',
            subItems: [
              'Visualize your TR progression with detailed step-by-step planning',
              'Live calculation of orb requirements and gains for each TR',
              'Calculate optimal boost combinations and their costs',
              'Interactive side panel showing real-time results while planning (Desktop only)'
            ]
          }
        ]
      }
    ]
  },
  {
    version: '2.2.2',
    date: '2025-04-13',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      'Integrated original Hunter and Resource icons from CIFI',
      'Special thanks to Chrysto / Octocube Games for providing the official assets!'
    ]
  },
  {
    version: '2.2.1',
    date: '2025-04-06',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      'Removed Tools Section temporarily to fix some bugs',
    ]
  },
  {
    version: '2.2.0',
    date: '2025-04-06',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      'Added Construction Milestones',
      'Changed Inscryption #87 to be multiplicative',
      'Improved Build Creator confirmation dialog to only show when changes have been made',
      'Fixed Revive Boost not getting applied correctly in the Build Evaluation',
      {
        text: 'Added Inscryption #32, #33 and #60 Cost Calculation',
        subItems: [
          'If you want to see more Inscryptions added, please contribute by helping filling out this sheet: <a href="https://docs.google.com/spreadsheets/d/1Vimt3zGCnQ_VeNgA_-hspX26Nk_YvOLdXDnYxRJ24Z4/edit?gid=1637743449" target="_blank" class="text-blue-400 hover:underline">Google Spreadsheet Link</a>'
        ]
      },
      {
        text: 'Added new Tools section:',
        subItems: [
          'TR Planner: Comprehensive replacement for the Shorts Planner with enhanced QoL features, visual progress indicators, and advanced optimization options'
        ]
      }
    ]
  },
  {
    version: '2.1.5',
    date: '2025-03-25',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      'Added boost type information to gadget labels in Gadget Calculator',
      'Added cost calculation for Inscryptions #80+ in Override Modal',
      'Added Inscryption cost support in Upgrade Comparison Window',
      'Early-game players: Please ping or DM me on Discord with screenshots of your Hunter relevant Inscryptions below #80 so I can add their cost calculations too!'
    ]
  },
  {
    version: '2.1.4',
    date: '2025-03-22',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      'Fixed Calculations on Upgrade Comparison Window',
    ]
  },
  {
    version: '2.1.3',
    date: '2025-03-22',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      'Added new Gadget Calculator to plan and visualize Tessarect costs (only visible in Knox Tab)',
      'Enhanced UI controls in Override and Upgrade Comparison Window',
      'Added a Buy me a Coffee link to support the project',
    ]
  },
  {
    version: '2.1.2',
    date: '2025-03-21',
    baseVersion: 'Kylenator\'s Sheet v1.2.5',
    changes: [
      'Updated to latest sheet version (1.2.5)',
      'Fixed i87 and i84 to be additive instead of multiplicative',
    ]
  },
  {
    version: '2.1.1',
    date: '2025-03-19',
    baseVersion: 'Kylenator\'s Sheet v1.2.4',
    changes: [
      'Fixed percentage calculation in Upgrade Comparison Window to correctly use daily values instead of per-run values'
    ]
  },
  {
    version: '2.1.0',
    date: '2025-03-18',
    baseVersion: 'Kylenator\'s Sheet v1.2.4',
    changes: [
      'New Upgrade Comparison Window: Compare different upgrade paths with detailed stat changes and loot collection time calculations',
      'Added Loot Filters for Mobile View: Customize your resource display for cleaner build comparisons',
      'Introduced Discord Build Preview: Build links now show proper level information when shared on Discord and make builds easier to find in search',
      'Fixed minor UI alignment issues in build cards'
    ]
  },
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
      <div v-for="release in changelog" :key="release.version" class="bg-gray-800 p-4 pl-8 rounded-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-white">Version {{ release.version }}</h2>
          <span class="text-gray-400">{{ release.date }}</span>
        </div>
        <p v-if="release.baseVersion" class="text-gray-400 mb-4">Based on {{ release.baseVersion }}</p>
        <ChangelogItem :items="release.changes" />
      </div>
    </div>
  </main>
</template>