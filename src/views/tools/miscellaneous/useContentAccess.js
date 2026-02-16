import { computed } from 'vue';
import { useGemPlannerStore } from '@/store/gemPlannerStore';

/**
 * Composable for content access control based on gem progression.
 * Centralizes all spoiler-free visibility checks so widgets can
 * gate content without knowing the underlying gem structure.
 *
 * Usage:
 *   const access = useContentAccess();
 *   access.hasGemLevel('innovation', 3)  // → computed boolean
 *   access.canSeeTemporalUltima.value    // → boolean
 */
export function useContentAccess() {
  const gemStore = useGemPlannerStore();

  // --- Generic checks ---

  /**
   * Check if a gem has reached at least the given level.
   * Returns a computed ref (reactive).
   */
  function hasGemLevel(gemId, minLevel) {
    return computed(() => {
      const state = gemStore.gemStates?.[gemId];
      return (state?.level ?? 0) >= minLevel;
    });
  }

  /**
   * Check if a specific gem node is active (1-indexed).
   * Nodes are stored as a 0-indexed boolean array internally.
   */
  function hasGemNode(gemId, nodeNumber) {
    return computed(() => {
      const state = gemStore.gemStates?.[gemId];
      if (!state?.nodes) return false;
      return !!state.nodes[nodeNumber - 1]; // convert 1-indexed → 0-indexed
    });
  }

  // --- Named feature gates ---

  /** Temporal Ultima Research requires Innovation Gem level ≥ 3 */
  const canSeeTemporalUltima = hasGemLevel('innovation', 3);

  /** Research #102 in LP Calculator requires Innovation Gem level ≥ 3 */
  const canSeeResearch102 = hasGemLevel('innovation', 3);

  /** T2R6 Level in LP Calculator requires Power Gem level ≥ 3 */
  const canSeeT2R6 = hasGemLevel('power', 3);

  /** Evolution Gem Node 5 reduces RP interval from 80 → 75 */
  const hasReducedRPInterval = hasGemNode('evolution', 5);

  /** The actual RP interval value (80 default, 75 with evolution node 5) */
  const rpInterval = computed(() => hasReducedRPInterval.value ? 75 : 80);

  return {
    // Generic
    hasGemLevel,
    hasGemNode,

    // Named gates
    canSeeTemporalUltima,
    canSeeResearch102,
    canSeeT2R6,
    hasReducedRPInterval,
    rpInterval,
  };
}
