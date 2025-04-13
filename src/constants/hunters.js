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

import iconBorge from '../assets/borge/hunter_small.png';
import iconOzzy from '../assets/ozzy/hunter_small.png';
import iconKnox from '../assets/knox/hunter_small.png';

export const HUNTERS = [
  {
    id: 'borge',
    name: 'Borge',
    color: 'red',
    icon: iconBorge,
    statsModule: () => import('./borge'),
  },
  {
    id: 'ozzy',
    name: 'Ozzy',
    color: 'green',
    icon: iconOzzy,
    statsModule: () => import('./ozzy'),
  },
  {
    id: 'knox',
    name: 'Knox',
    color: 'blue',
    icon: iconKnox,
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

export function getAllHunters() {
  return HUNTERS;
}