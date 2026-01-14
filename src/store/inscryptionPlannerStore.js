import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { formatNumber } from '@/composables/format.js';
import { useHunterStore } from '@/store/hunterStore.js';

export const useInscryptionPlannerStore = defineStore('inscryptionPlanner', () => {
  // CSV Data (not persistent, loaded fresh each time)
  const inscryptionsData = ref([]); // Now contains only Rank 1 entries for metadata
  const allInscryptionsData = ref([]); // Contains ALL ranks with real prices
  const isLoading = ref(false);
  const error = ref(null);

  // Shopping List (persistent via localStorage with useStorage)
  const shoppingList = useStorage('inscryption-shopping-list', []);
  
  // Owned Inscryptions (persistent via localStorage)
  const ownedInscryptions = useStorage('inscryption-owned', {});
  
  // Settings (persistent via localStorage)
  const settings = useStorage('inscryption-planner-settings', {
    hellishBiomatterProduction: 0,
    selectedBuild: null, // Borge build reference
    showTiers: true,
    sortBy: 'id', // 'id' or 'cost'
    sortOrder: 'asc', // 'asc' or 'desc'
    hideOwned: false,
    autoUpdateHBM: true, // Auto-update HBM based on production
    // HBM tracking with timestamp
    currentHBM: {
      value: 0,
      timestamp: Date.now()
    }
  });

  // Computed
  const totalShoppingCost = computed(() => {
    return shoppingList.value.reduce((total, item) => {
      return total + (item.costSci || 0) * item.quantity;
    }, 0);
  });

  const organizedShoppingList = computed(() => {
    const grouped = {};
    shoppingList.value.forEach(item => {
      const key = item.inscryptionId;
      if (!grouped[key]) {
        grouped[key] = {
          ...item,
          totalQuantity: 0,
          totalCost: 0
        };
      }
      grouped[key].totalQuantity += item.quantity;
      grouped[key].totalCost += (item.costSci || 0) * item.quantity;
    });
    return Object.values(grouped);
  });

  // Calculate shopping list with cumulative HBM production
  const shoppingListWithHBMProduction = computed(() => {
    const baseHBMProduction = settings.value.hellishBiomatterProduction || 0;
    let currentHBMProduction = baseHBMProduction;
    
    return shoppingList.value.map((item, index) => {
      // Find the inscryption data to check for Borge Buff
      const inscryptionData = allInscryptionsData.value.find(
        data => data.inscryptionId === item.inscryptionId && data.rank === item.rank
      );
      
      const itemWithHBM = {
        ...item,
        currentHBMProduction: currentHBMProduction,
        newHBMProduction: currentHBMProduction
      };
      
      // Check if this inscryption has Borge Buff = 1 (HBM income multiplier)
      if (inscryptionData && inscryptionData.borgeBuff === 1) {
        // Parse ALL buff multipliers (e.g., "x1.05;x1.10" -> [1.05, 1.10])
        const buffString = inscryptionData.buffPerRank || '';
        const multiplierMatches = buffString.match(/x?(\d+\.?\d*)/g);
        if (multiplierMatches && multiplierMatches.length > 0) {
          // Calculate combined multiplier by multiplying all found multipliers
          let combinedMultiplier = 1.0;
          
          multiplierMatches.forEach(match => {
            const cleanMatch = match.replace('x', '');
            const multiplier = parseFloat(cleanMatch);
            if (!isNaN(multiplier)) {
              combinedMultiplier *= multiplier;
            }
          });
          
          currentHBMProduction *= combinedMultiplier;
          itemWithHBM.newHBMProduction = currentHBMProduction;
          itemWithHBM.hbmMultiplier = combinedMultiplier;
        }
      }
      
      return itemWithHBM;
    });
  });

  // Show only the next available rank for each inscryption
  const availableInscryptions = computed(() => {
    if (!inscryptionsData.value || inscryptionsData.value.length === 0) {
      return [];
    }

    // Auto-sync from global inscryptions whenever this computed is accessed
    const hunterStore = useHunterStore();
    if (hunterStore) {
      syncFromGlobalInscryptions(hunterStore);
    }

    const result = [];

    // For each inscryption (now only Rank 1 entries from CSV)
    inscryptionsData.value.forEach(baseInscryption => {
      const id = baseInscryption.inscryptionId;
      
      // Get owned ranks for this inscryption
      const ownedRanks = ownedInscryptions.value[id] || [];
      
      // Get shopping list ranks for this inscyption
      const shoppingListRanks = shoppingList.value
        .filter(item => item.inscryptionId === id)
        .map(item => item.rank);
      
      // Find the next rank to buy (from 1 to maxRanks)
      for (let rank = 1; rank <= baseInscryption.maxRanks; rank++) {
        const isOwned = ownedRanks.includes(rank);
        const isInShoppingList = shoppingListRanks.includes(rank);
        
        if (!isOwned && !isInShoppingList) {
          // Find the real price data for this rank from allInscryptionsData
          const rankData = allInscryptionsData.value.find(
            item => item.inscryptionId === id && item.rank === rank
          );
          
          // Use the parsed cost from Cost(Label) for accuracy
          const realCost = rankData ? rankData.cost : 0;
          
          // This is the next rank to buy - create a virtual inscryption object for this rank
          const nextRankInscryption = {
            ...baseInscryption,
            rank: rank,
            // Use real cost from CSV Cost(Label) data
            costSci: realCost,
            costLabel: formatNumber(realCost)
          };
          
          result.push(nextRankInscryption);
          break; // Only show the NEXT rank, not all remaining ranks
        }
      }
    });

    return result;
  });

  // Actions
  async function loadInscryptionsData() {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuA9mNH247uQbM1RrsPN8h0zbszvTVBR87Zt3FmQguuk5lQTvYLc3mA9f8W6ZsI_BYCuhhcG-bzi2c/pub?gid=1059394957&single=true&output=csv'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      const data = parseCSV(csvText);
      
      // Wrap the state change in a view transition for smooth appearance
      if (document.startViewTransition) {
        document.documentElement.classList.add('in-page-transition');
        const transition = document.startViewTransition(() => {
          inscryptionsData.value = data;
          isLoading.value = false;
        });
        transition.finished.finally(() => {
          document.documentElement.classList.remove('in-page-transition');
        });
      } else {
        // Fallback for browsers without View Transition API
        inscryptionsData.value = data;
        isLoading.value = false;
      }
      
    } catch (err) {
      console.error('Failed to load inscryptions data:', err);
      error.value = 'Failed to load inscryptions data. Please try again.';
      isLoading.value = false;
    }
  }

  // Helper function to parse cost labels (e.g., "1K", "2.5M", "100") into numbers
  function parseCostLabel(label) {
    if (!label || label === '') return 0;
    
    const str = label.toString().trim().toLowerCase(); // Use lowercase to match formatNumber
    
    // Handle simple numbers
    if (!isNaN(str)) {
      return parseFloat(str);
    }
    
    // Handle suffixed numbers - use same suffixes as formatNumber function
    const suffixes = {
      'k': 1e3,
      'm': 1e6,
      'b': 1e9,
      't': 1e12,
      'qa': 1e15,
      'qu': 1e18,
      'sx': 1e21,
      'sp': 1e24,
      'o': 1e27,
      'n': 1e30,
      'd': 1e33
    };
    
    // Try to match suffix
    for (const [suffix, multiplier] of Object.entries(suffixes)) {
      if (str.endsWith(suffix)) {
        const numberPart = str.slice(0, -suffix.length);
        const number = parseFloat(numberPart);
        if (!isNaN(number)) {
          return number * multiplier;
        }
      }
    }
    
    // If no suffix matches, try to parse as number
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  }

  function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const allData = [];
    const rank1Data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = lines[i].split(',');
      const row = {};
      
      headers.forEach((header, index) => {
        let value = values[index]?.trim() || '';
        
        // Parse specific fields
        switch (header) {
          case 'i#':
            row.inscryptionId = parseInt(value) || 0;
            break;
          case 'Rank':
            row.rank = parseInt(value) || 1;
            break;
          case 'Cost(Sci)':
            row.costSci = parseFloat(value) || 0;
            break;
          case 'Cost(Label)':
            // Parse the cost label into a number
            row.costLabel = value;
            row.cost = parseCostLabel(value);
            break;
          case 'Cost Scaling':
            row.costScaling = value;
            break;
          case 'Buff per Rank':
            row.buffPerRank = value;
            break;
          case 'Max Ranks':
            row.maxRanks = parseInt(value) || 1;
            break;
          case 'Borge Buff':
            row.borgeBuff = parseInt(value) || 0;
            break;
          case 'Description':
            row.description = value;
            break;
          case 'Icon':
            row.icon = value;
            break;
          default:
            // Ignore other fields like Current Buff, Final Rank, Purchased
            break;
        }
      });
      
      // Add to allData (contains all ranks)
      allData.push(row);
      
      // Only include Rank 1 rows for metadata
      if (row.rank === 1) {
        rank1Data.push(row);
      }
    }
    
    // Store both datasets
    allInscryptionsData.value = allData;
    return rank1Data;
  }

  async function addToShoppingList(inscryption, quantity = 1) {
    // Get icon from inscryption or look it up from inscryptionsData (Rank 1 metadata)
    let iconValue = inscryption.icon;
    if (!iconValue || iconValue === 'default' || iconValue === '') {
      // Look up icon from Rank 1 metadata
      const rank1Data = inscryptionsData.value.find(
        data => data.inscryptionId === inscryption.inscryptionId
      );
      if (rank1Data && rank1Data.icon) {
        iconValue = rank1Data.icon;
      }
    }
    
    const item = {
      id: `${inscryption.inscryptionId}-${inscryption.rank}-${Date.now()}`,
      inscryptionId: inscryption.inscryptionId,
      rank: inscryption.rank,
      description: inscryption.description,
      costSci: inscryption.costSci, // This is now the parsed cost from Cost(Label)
      costLabel: formatNumber(inscryption.costSci), // Format using formatNumber
      buffPerRank: inscryption.buffPerRank,
      icon: iconValue || 'default', // Preserve icon for shopping list display
      quantity: quantity,
      addedAt: new Date().toISOString(),
      // Preserve stat upgrade properties
      isStatUpgrade: inscryption.isStatUpgrade || false,
      statKey: inscryption.statKey || null,
      name: inscryption.name || null,
      currentLevel: inscryption.currentLevel || null,
      nextLevel: inscryption.nextLevel || null,
      maxLevel: inscryption.maxLevel || null
    };

    // Wrap the state change in a view transition for smooth appearance
    if (document.startViewTransition) {
      document.documentElement.classList.add('in-page-transition');
      const transition = document.startViewTransition(() => {
        shoppingList.value.push(item);
      });
      transition.finished.finally(() => {
        document.documentElement.classList.remove('in-page-transition');
      });
    } else {
      // Fallback for browsers without View Transition API
      shoppingList.value.push(item);
    }
  }

  async function removeFromShoppingList(itemId) {
    const index = shoppingList.value.findIndex(item => item.id === itemId);
    if (index !== -1) {
      // Wrap the state change in a view transition for smooth removal
      if (document.startViewTransition) {
        document.documentElement.classList.add('in-page-transition');
        const transition = document.startViewTransition(() => {
          shoppingList.value.splice(index, 1);
        });
        transition.finished.finally(() => {
          document.documentElement.classList.remove('in-page-transition');
        });
      } else {
        // Fallback for browsers without View Transition API
        shoppingList.value.splice(index, 1);
      }
    }
  }

  async function updateShoppingItemQuantity(itemId, quantity) {
    const item = shoppingList.value.find(item => item.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
  }

  async function clearShoppingList() {
    // Wrap the state change in a view transition for smooth clearing
    if (document.startViewTransition) {
      document.documentElement.classList.add('in-page-transition');
      const transition = document.startViewTransition(() => {
        shoppingList.value.length = 0;
      });
      transition.finished.finally(() => {
        document.documentElement.classList.remove('in-page-transition');
      });
    } else {
      // Fallback for browsers without View Transition API
      shoppingList.value.length = 0;
    }
  }

  // Ownership Actions
  function updateOwnedInscryptions(newOwnership) {
    ownedInscryptions.value = { ...newOwnership };
  }

  function isInscryptionOwned(inscryptionId, rank) {
    return ownedInscryptions.value[inscryptionId]?.includes(rank) || false;
  }

  function getOwnedRanksForInscryption(inscryptionId) {
    return ownedInscryptions.value[inscryptionId] || [];
  }

  function clearAllOwnership() {
    ownedInscryptions.value = {};
  }

  // Sync global inscryptions to owned inscryptions
  function syncFromGlobalInscryptions(hunterStore) {
    if (!hunterStore?.upgrades?.inscryptions) {
      console.warn('No global inscryptions found to sync');
      return;
    }

    const globalInscryptions = hunterStore.upgrades.inscryptions;
    const updatedOwnership = { ...ownedInscryptions.value };

    Object.entries(globalInscryptions).forEach(([inscryptionId, level]) => {
      if (level > 0) {
        // Die globalen IDs haben das Format "i3", "i4", etc.
        // Die Planner IDs haben das Format "3", "4", etc.
        // Konvertiere globale ID zu Planner ID
        const plannerInscryptionId = inscryptionId.startsWith('i') 
          ? inscryptionId.slice(1) // Entferne das "i" Präfix
          : inscryptionId;
        
        // Erstelle Array mit allen Ranks von 1 bis zum aktuellen Level
        const ownedRanks = Array.from({ length: level }, (_, i) => i + 1);
        updatedOwnership[plannerInscryptionId] = ownedRanks;
      }
    });

    // Aktualisiere den Store
    ownedInscryptions.value = updatedOwnership;
    
    console.log('Synced global inscryptions to planner:', updatedOwnership);
  }

  // Initialize store
  async function initialize() {
    await loadInscryptionsData();
  }

  // HBM Management Functions
  function updateCurrentHBM(newValue) {
    settings.value.currentHBM = {
      value: Math.max(0, newValue),
      timestamp: Date.now()
    };
  }

  function getCurrentHBMWithProduction() {
    // Ensure currentHBM is properly structured (for backward compatibility with old localStorage data)
    if (!settings.value.currentHBM || typeof settings.value.currentHBM !== 'object' || !settings.value.currentHBM.timestamp) {
      // Initialize with default structure if missing or invalid
      settings.value.currentHBM = {
        value: typeof settings.value.currentHBM === 'number' ? settings.value.currentHBM : 0,
        timestamp: Date.now()
      };
      return settings.value.currentHBM.value;
    }
    
    const now = Date.now();
    const elapsedMs = now - settings.value.currentHBM.timestamp;
    const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
    
    const dailyProduction = settings.value.hellishBiomatterProduction || 0;
    const producedHBM = elapsedDays * dailyProduction;
    
    const totalHBM = settings.value.currentHBM.value + producedHBM;
    
    return Math.max(0, totalHBM);
  }

  function resetHBMTimestamp() {
    // Ensure currentHBM is properly structured before resetting
    if (!settings.value.currentHBM || typeof settings.value.currentHBM !== 'object') {
      settings.value.currentHBM = {
        value: typeof settings.value.currentHBM === 'number' ? settings.value.currentHBM : 0,
        timestamp: Date.now()
      };
      return;
    }
    
    const currentCalculated = getCurrentHBMWithProduction();
    settings.value.currentHBM = {
      value: currentCalculated,
      timestamp: Date.now()
    };
  }

  return {
    // State
    inscryptionsData,
    isLoading,
    error,
    shoppingList,
    ownedInscryptions,
    settings,

    // Computed
    totalShoppingCost,
    organizedShoppingList,
    shoppingListWithHBMProduction,
    availableInscryptions,  // MIT Y!

    // Actions
    loadInscryptionsData,
    addToShoppingList,
    removeFromShoppingList,
    updateShoppingItemQuantity,
    clearShoppingList,
    updateOwnedInscryptions,
    isInscryptionOwned,
    getOwnedRanksForInscryption,
    clearAllOwnership,
    syncFromGlobalInscryptions,
    initialize,
    
    // HBM Management
    updateCurrentHBM,
    getCurrentHBMWithProduction,
    resetHBMTimestamp
  };
});