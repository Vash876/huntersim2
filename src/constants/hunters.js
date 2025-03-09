/**
 * Zentrale Konfiguration für alle Hunter
 * Enthält Informationen zu Namen, Farben, Stats-Modulen und Store-Referenzen
 *
 */

import { 
  IconTool, 
  IconProng, 
  IconAnchor,
} from '@tabler/icons-vue';

export const HUNTERS = [
  {
    id: 'borge',
    name: 'Borge',
    color: 'red',
    icon: IconTool,
    statsModule: () => import('./borge'),
  },
  {
    id: 'ozzy',
    name: 'Ozzy',
    color: 'green',
    icon: IconProng,
    statsModule: () => import('./ozzy'),
  },
  {
    id: 'knox',
    name: 'Knox',
    color: 'blue',
    icon: IconAnchor,
    statsModule: () => import('./knox'),
  }
];

/**
 * Hilfsfunktion zum Abrufen von Hunter-Informationen anhand der ID
 */
export function getHunterById(hunterId) {
  const hunter = HUNTERS.find(h => h.id === hunterId);
  if (!hunter) {
    // Fallback auf ersten Hunter, wenn nicht gefunden
    return HUNTERS[0];
  }
  return hunter;
}