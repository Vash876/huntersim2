/**
 * Widget registry for Miscellaneous tools.
 * Each widget defines its id, label, component, and card styling.
 */
import { defineAsyncComponent } from 'vue';

export const WIDGETS = [
  {
    id: 'cellUltima',
    label: 'Cell Ultima Research',
    component: defineAsyncComponent(() => import('./components/CellUltimaCalc.vue')),
    border: 'border-green-800/30',
    bg: 'bg-gradient-to-br from-green-950/40 via-gray-800/60 to-gray-900/80',
    accent: 'from-transparent via-green-500 to-transparent',
    hoverShadow: 'hover:shadow-green-900/20',
  },
  {
    id: 'temporalUltima',
    label: 'Temporal Ultima Research',
    requires: (access) => access.canSeeTemporalUltima.value,
    component: defineAsyncComponent(() => import('./components/TemporalUltimaCalc.vue')),
    border: 'border-red-800/30',
    bg: 'bg-gradient-to-br from-red-950/40 via-gray-800/60 to-gray-900/80',
    accent: 'from-transparent via-red-500 to-transparent',
    hoverShadow: 'hover:shadow-red-900/20',
  },
  {
    id: 'lpCalculator',
    label: 'LP Calculator',
    component: defineAsyncComponent(() => import('./components/LPCalculator.vue')),
    border: 'border-purple-800/30',
    bg: 'bg-gradient-to-br from-purple-950/40 via-gray-800/60 to-gray-900/80',
    accent: 'from-transparent via-purple-500 to-transparent',
    hoverShadow: 'hover:shadow-purple-900/20',
  },
  {
    id: 'exponentHelper',
    label: 'Exponent Helper',
    component: defineAsyncComponent(() => import('./components/ExponentHelper.vue')),
    border: 'border-amber-800/30',
    bg: 'bg-gradient-to-br from-amber-950/40 via-gray-800/60 to-gray-900/80',
    accent: 'from-transparent via-amber-500 to-transparent',
    hoverShadow: 'hover:shadow-amber-900/20',
  },
];

/** Map of id → widget definition for quick lookup */
export const WIDGET_MAP = Object.fromEntries(WIDGETS.map(w => [w.id, w]));
