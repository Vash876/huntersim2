import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { 
  getTraitSphereById, 
  isAdjacentToAnySelected,
  traitSpheres
} from '@/constants/ts-planner';
import { useGemPlannerStore } from '@/store/gemPlannerStore';

export const useTSStore = defineStore('tsPlanner', () => {
  // Settings mit useStorage für Persistence
  const settings = useStorage('ts-planner-settings', {
    // Milestone Settings
    startCellMilestones: 0,
    startMPMilestones: 0,
    startRPMilestones: 0,
    currentCellMilestones: 0,
    currentMPMilestones: 0,
    currentRPMilestones: 0,
    
    // Boon of Juncture
    boonOfJuncture: false,
    
    // Trait Sphere Selection
    selectedTraitSpheres: [1], // TS#1 immer ausgewählt
    floatingPointSpheres: [], // Vorgemerkte Trait Spheres
    
    // LP Statistics
    playerLevel: 0,
    researchLevels: 0,
    lpAchievements: 0,
    shipEvolutions: 0,
    
    // UI State
    hideFloatingPointHint: false // Info-Banner für Long Press
  });

  // Gem Planner Store für Evolution Gem Nodes
  const gemPlannerStore = useGemPlannerStore();

  // ==================== COMPUTED: Evolution Gem Nodes ====================
  
  const evolutionGemNode2Active = computed(() => {
    const evolutionGemState = gemPlannerStore.getGemState('evolution');
    return evolutionGemState?.nodes?.[1] || false; // Node #2 ist Index 1
  });

  const evolutionGemNode5Active = computed(() => {
    const evolutionGemState = gemPlannerStore.getGemState('evolution');
    return evolutionGemState?.nodes?.[4] || false; // Node #5 ist Index 4
  });

  // ==================== COMPUTED: Milestone Costs ====================
  
  const nextCellMilestoneCost = computed(() => {
    const nextLevel = settings.value.currentCellMilestones + 1;
    if (nextLevel === 1) return 500;
    if (nextLevel === 2) return 5000;
    return 5000 + (nextLevel - 2) * 5000;
  });

  const nextMPMilestoneCost = computed(() => {
    const nextLevel = settings.value.currentMPMilestones + 1;
    if (nextLevel === 1) return 1000;
    return 1000 + (nextLevel - 1) * 500;
  });

  const nextRPMilestoneCost = computed(() => {
    const nextLevel = settings.value.currentRPMilestones + 1;
    if (nextLevel === 1) return 800;
    return 800 + (nextLevel - 1) * 400;
  });

  // ==================== COMPUTED: Antimatter Cores ====================
  
  const currentCores = computed(() => {
    return settings.value.startCellMilestones * 2 + 
           settings.value.startMPMilestones * 2 + 
           settings.value.startRPMilestones * 2 +
           (settings.value.currentCellMilestones - settings.value.startCellMilestones) +
           (settings.value.currentMPMilestones - settings.value.startMPMilestones) +
           (settings.value.currentRPMilestones - settings.value.startRPMilestones) +
           (settings.value.boonOfJuncture ? 1 : 0);
  });

  const totalCores = computed(() => {
    return settings.value.currentCellMilestones * 2 +
           settings.value.currentMPMilestones * 2 +
           settings.value.currentRPMilestones * 2 +
           (settings.value.boonOfJuncture ? 1 : 0);
  });

  const usedCores = computed(() => {
    return settings.value.selectedTraitSpheres.reduce((sum, sphereId) => {
      const sphere = getTraitSphereById(sphereId);
      return sum + (sphere?.price || 0);
    }, 0);
  });

  const remainingCores = computed(() => {
    return currentCores.value - usedCores.value;
  });

  // ==================== COMPUTED: Floating Points ====================
  
  const floatingPointCost = computed(() => {
    const totalCost = settings.value.floatingPointSpheres.reduce((sum, sphereId) => {
      const sphere = getTraitSphereById(sphereId);
      return sum + (sphere?.price || 0);
    }, 0);
    
    const needed = totalCost - remainingCores.value;
    return Math.max(0, needed);
  });

  // ==================== COMPUTED: Available Trait Spheres ====================
  
  const availableTraitSpheres = computed(() => {
    return traitSpheres
      .filter(sphere => sphere.id > 0 && sphere.effect !== 'locked' && sphere.description)
      .sort((a, b) => a.id - b.id);
  });

  // ==================== COMPUTED: LP Calculations ====================
  
  // LP von einzelnen Quellen (immer berechnet für Anzeige)
  const lpFromPlayerLevel = computed(() => {
    return Math.floor(settings.value.playerLevel / 10) * 4;
  });

  const lpFromResearch = computed(() => {
    return settings.value.researchLevels;
  });

  const lpFromShipEvolutions = computed(() => {
    return settings.value.shipEvolutions * 30;
  });

  const lpFromAchievements = computed(() => {
    return settings.value.lpAchievements + 30;
  });

  const lpFromPlayerLevelTS19 = computed(() => {
    return settings.value.playerLevel;
  });

  // LP von ausgewählten Trait Spheres (für aktive Berechnung)
  const lpFromPlayerLevelActive = computed(() => {
    return isSelected(2) ? lpFromPlayerLevel.value : 0;
  });

  const lpFromResearchActive = computed(() => {
    return isSelected(8) ? lpFromResearch.value : 0;
  });

  const lpFromShipEvolutionsActive = computed(() => {
    return isSelected(15) ? lpFromShipEvolutions.value : 0;
  });

  const lpFromAchievementsActive = computed(() => {
    return isSelected(16) ? lpFromAchievements.value : 0;
  });

  const lpFromPlayerLevelTS19Active = computed(() => {
    return isSelected(19) ? lpFromPlayerLevelTS19.value : 0;
  });

  // Total LP
  const totalLP = computed(() => {
    return lpFromPlayerLevel.value + 
           lpFromResearch.value + 
           lpFromShipEvolutions.value + 
           lpFromAchievements.value + 
           lpFromPlayerLevelTS19.value;
  });

  const totalLPSelected = computed(() => {
    return lpFromPlayerLevelActive.value + 
           lpFromResearchActive.value + 
           lpFromShipEvolutionsActive.value + 
           lpFromAchievementsActive.value + 
           lpFromPlayerLevelTS19Active.value;
  });

  // LP Multipliers (einzelne Quellen)
  const lpFromPlayerLevelMultiplier = computed(() => {
    const divisor = evolutionGemNode5Active.value ? 9 : 10;
    return Math.pow(2, Math.floor(lpFromPlayerLevel.value / divisor));
  });

  const lpFromResearchMultiplier = computed(() => {
    const divisor = evolutionGemNode5Active.value ? 9 : 10;
    return Math.pow(2, Math.floor(lpFromResearch.value / divisor));
  });

  const lpFromShipEvolutionsMultiplier = computed(() => {
    const divisor = evolutionGemNode5Active.value ? 9 : 10;
    return Math.pow(2, Math.floor(lpFromShipEvolutions.value / divisor));
  });

  const lpFromAchievementsMultiplier = computed(() => {
    const divisor = evolutionGemNode5Active.value ? 9 : 10;
    return Math.pow(2, Math.floor(lpFromAchievements.value / divisor));
  });

  const lpFromPlayerLevelTS19Multiplier = computed(() => {
    const divisor = evolutionGemNode5Active.value ? 9 : 10;
    return Math.pow(2, Math.floor(lpFromPlayerLevelTS19.value / divisor));
  });

  // Combined Multiplier
  const combinedMultiplier = computed(() => {
    const divisor = evolutionGemNode5Active.value ? 9 : 10;
    return Math.pow(2, Math.floor(totalLP.value / divisor));
  });

  const combinedMultiplierSelected = computed(() => {
    const divisor = evolutionGemNode5Active.value ? 9 : 10;
    return Math.pow(2, Math.floor(totalLPSelected.value / divisor));
  });

  // RP Multipliers (nur wenn Evolution Gem Node #2 aktiv)
  const rpFromPlayerLevelMultiplier = computed(() => {
    if (!evolutionGemNode2Active.value) return 1;
    const divisor = evolutionGemNode5Active.value ? 70 : 80;
    return Math.pow(2, Math.floor(lpFromPlayerLevel.value / divisor));
  });

  const rpFromResearchMultiplier = computed(() => {
    if (!evolutionGemNode2Active.value) return 1;
    const divisor = evolutionGemNode5Active.value ? 70 : 80;
    return Math.pow(2, Math.floor(lpFromResearch.value / divisor));
  });

  const rpFromShipEvolutionsMultiplier = computed(() => {
    if (!evolutionGemNode2Active.value) return 1;
    const divisor = evolutionGemNode5Active.value ? 70 : 80;
    return Math.pow(2, Math.floor(lpFromShipEvolutions.value / divisor));
  });

  const rpFromAchievementsMultiplier = computed(() => {
    if (!evolutionGemNode2Active.value) return 1;
    const divisor = evolutionGemNode5Active.value ? 70 : 80;
    return Math.pow(2, Math.floor(lpFromAchievements.value / divisor));
  });

  const rpFromPlayerLevelTS19Multiplier = computed(() => {
    if (!evolutionGemNode2Active.value) return 1;
    const divisor = evolutionGemNode5Active.value ? 70 : 80;
    return Math.pow(2, Math.floor(lpFromPlayerLevelTS19.value / divisor));
  });

  const combinedRPMultiplier = computed(() => {
    if (!evolutionGemNode2Active.value) return 1;
    const divisor = evolutionGemNode5Active.value ? 70 : 80;
    return Math.pow(2, Math.floor(totalLPSelected.value / divisor));
  });

  // ==================== ACTIONS: Selection Logic ====================
  
  function isSelected(sphereId) {
    return sphereId !== undefined && settings.value.selectedTraitSpheres.includes(sphereId);
  }

  function isFloatingPoint(sphereId) {
    return sphereId !== undefined && settings.value.floatingPointSpheres.includes(sphereId);
  }

  function canSelect(sphere) {
    if (!sphere || sphere.id < 0) return false;
    if (sphere.effect === 'locked') return false;
    
    // TS#1 ist immer ausgewählt und kann nicht abgewählt werden
    if (sphere.id === 1) return true;
    
    // If already selected, can be deselected
    if (isSelected(sphere.id)) return true;

    // Prüfen ob die Trait Sphere zu mindestens einer bereits ausgewählten benachbart ist
    const isAdjacent = isAdjacentToAnySelected(sphere.id, settings.value.selectedTraitSpheres);
    if (!isAdjacent) return false;
    
    // Check if we have enough cores
    return sphere.price <= remainingCores.value;
  }

  function willRemovalBreakConnectivity(sphereIdToRemove) {
    // Wenn nur TS#1 oder die zu entfernende Trait Sphere ausgewählt sind, kann nichts isoliert werden
    if (settings.value.selectedTraitSpheres.length <= 2) return false;
    
    // Die zu entfernende Sphere aus der Auswahl herausnehmen
    const remainingSelected = settings.value.selectedTraitSpheres.filter(id => id !== sphereIdToRemove);
    
    // BFS zum Prüfen der Konnektivität von TS#1 aus
    const visited = new Set();
    const queue = [1]; // Starten bei TS#1
    
    while (queue.length > 0) {
      const currentId = queue.shift();
      visited.add(currentId);
      
      // Alle ausgewählten Nachbarn finden und zur Queue hinzufügen
      const neighbors = remainingSelected.filter(id => 
        id !== currentId && isAdjacentToAnySelected(currentId, [id])
      );
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
    
    // Wenn wir nicht alle ausgewählten erreichen konnten, würde das Entfernen die Konnektivität brechen
    return visited.size !== remainingSelected.length;
  }

  function toggleSphere(sphere) {
    if (!sphere || sphere.id < 0 || sphere.effect === 'locked') return;
    
    // TS#1 kann nicht abgewählt werden
    if (sphere.id === 1) return;
    
    const isCurrentlySelected = settings.value.selectedTraitSpheres.includes(sphere.id);
    const isCurrentlyFloating = settings.value.floatingPointSpheres.includes(sphere.id);
    
    if (isCurrentlyFloating) {
      // Sphere ist als Floating Point markiert
      // Einfacher Klick: Versuche zu kaufen (wenn genug Cores) oder unmarkiere
      const isAdjacent = isAdjacentToAnySelected(sphere.id, settings.value.selectedTraitSpheres);
      const canAfford = sphere.price <= remainingCores.value;
      
      if (isAdjacent && canAfford) {
        // Genug Cores: Kaufe die Sphere
        settings.value.selectedTraitSpheres.push(sphere.id);
        // Entferne aus Floating Points
        const fpIndex = settings.value.floatingPointSpheres.indexOf(sphere.id);
        if (fpIndex !== -1) {
          settings.value.floatingPointSpheres.splice(fpIndex, 1);
        }
      } else {
        // Nicht genug Cores oder nicht adjacent: Unmarkiere Floating Point
        const fpIndex = settings.value.floatingPointSpheres.indexOf(sphere.id);
        if (fpIndex !== -1) {
          settings.value.floatingPointSpheres.splice(fpIndex, 1);
        }
      }
    } else if (isCurrentlySelected) {
      // Sphere ist ausgewählt: Entfernen wenn möglich
      if (willRemovalBreakConnectivity(sphere.id)) {
        return;
      }
      
      const index = settings.value.selectedTraitSpheres.indexOf(sphere.id);
      if (index !== -1) {
        settings.value.selectedTraitSpheres.splice(index, 1);
      }
    } else {
      // Sphere ist weder selected noch floating: Versuche zu kaufen
      const isAdjacent = isAdjacentToAnySelected(sphere.id, settings.value.selectedTraitSpheres);
      const canAfford = sphere.price <= remainingCores.value;
      
      if (isAdjacent && canAfford) {
        settings.value.selectedTraitSpheres.push(sphere.id);
      }
    }
  }

  function toggleFloatingPoint(sphere) {
    if (!sphere || sphere.id < 0 || sphere.effect === 'locked') return;
    
    // TS#1 kann nicht als Floating Point markiert werden
    if (sphere.id === 1) return;
    
    // Bereits ausgewählte Spheres können nicht als Floating Point markiert werden
    if (isSelected(sphere.id)) return;
    
    const index = settings.value.floatingPointSpheres.indexOf(sphere.id);
    
    if (index === -1) {
      // Check adjacency: only allow marking adjacent spheres
      const isAdjacent = isAdjacentToAnySelected(sphere.id, settings.value.selectedTraitSpheres);
      if (!isAdjacent) return;
      
      // Add to floating points (multiple allowed)
      settings.value.floatingPointSpheres.push(sphere.id);
    } else {
      // Entfernen aus Floating Points (Long press auf gelbe Sphere)
      settings.value.floatingPointSpheres.splice(index, 1);
    }
  }

  function clearSelection() {
    settings.value.selectedTraitSpheres = [1]; // Nur TS#1 beibehalten
    settings.value.floatingPointSpheres = []; // Floating Points auch clearen
  }

  function clearFloatingPoints() {
    settings.value.floatingPointSpheres = [];
  }

  function applyPreset(preset) {
    // Überprüfe, ob wir uns das Preset leisten können
    const presetCost = preset.spheres.reduce((total, sphereId) => {
      const sphere = getTraitSphereById(sphereId);
      return total + (sphere?.price || 0);
    }, 0);
    
    if (presetCost <= currentCores.value) {
      settings.value.selectedTraitSpheres = [...preset.spheres];
      
      // Apply floating points from preset if available
      if (preset.floating && Array.isArray(preset.floating)) {
        // Only add floating points that are not already selected
        const validFloating = preset.floating.filter(fpId => !preset.spheres.includes(fpId));
        settings.value.floatingPointSpheres = validFloating;
      } else {
        // Clear floating points if preset doesn't have any
        settings.value.floatingPointSpheres = [];
      }
    }
  }

  function resetSettings() {
    settings.value.startCellMilestones = 0;
    settings.value.startMPMilestones = 0;
    settings.value.startRPMilestones = 0;
    settings.value.currentCellMilestones = 0;
    settings.value.currentMPMilestones = 0;
    settings.value.currentRPMilestones = 0;
    settings.value.boonOfJuncture = false;
    settings.value.selectedTraitSpheres = [1];
    settings.value.floatingPointSpheres = [];
    settings.value.playerLevel = 0;
    settings.value.researchLevels = 0;
    settings.value.lpAchievements = 0;
    settings.value.shipEvolutions = 0;
  }

  // ==================== RETURN ====================
  
  return {
    // State
    settings,
    
    // Computed: Evolution Gem Nodes
    evolutionGemNode2Active,
    evolutionGemNode5Active,
    
    // Computed: Milestone Costs
    nextCellMilestoneCost,
    nextMPMilestoneCost,
    nextRPMilestoneCost,
    
    // Computed: Antimatter Cores
    currentCores,
    totalCores,
    usedCores,
    remainingCores,
    
    // Computed: Floating Points
    floatingPointCost,
    
    // Computed: Available Trait Spheres
    availableTraitSpheres,
    
    // Computed: LP Calculations
    lpFromPlayerLevel,
    lpFromResearch,
    lpFromShipEvolutions,
    lpFromAchievements,
    lpFromPlayerLevelTS19,
    lpFromPlayerLevelActive,
    lpFromResearchActive,
    lpFromShipEvolutionsActive,
    lpFromAchievementsActive,
    lpFromPlayerLevelTS19Active,
    totalLP,
    totalLPSelected,
    
    // Computed: LP Multipliers
    lpFromPlayerLevelMultiplier,
    lpFromResearchMultiplier,
    lpFromShipEvolutionsMultiplier,
    lpFromAchievementsMultiplier,
    lpFromPlayerLevelTS19Multiplier,
    combinedMultiplier,
    combinedMultiplierSelected,
    
    // Computed: RP Multipliers
    rpFromPlayerLevelMultiplier,
    rpFromResearchMultiplier,
    rpFromShipEvolutionsMultiplier,
    rpFromAchievementsMultiplier,
    rpFromPlayerLevelTS19Multiplier,
    combinedRPMultiplier,
    
    // Actions
    isSelected,
    isFloatingPoint,
    canSelect,
    toggleSphere,
    toggleFloatingPoint,
    clearSelection,
    clearFloatingPoints,
    applyPreset,
    resetSettings
  };
});
