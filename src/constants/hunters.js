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
    unlock: 'exodus',
    unlock_lvl: 1,
    icon: IconTool,
    image: iconBorge,
    discord_level_image: ':CIFI_EXPHuntBorge:',
    statsModule: () => import('./borge'),
    buildRepositoryCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuTy7CSusoWz8YNaIhuWJ5QWzOmbt62BQREuwJns96O9GEHuxPW6q47t4-o51m-og4Vn7yvxeqFRFE/pub?gid=1331115213&single=true&output=csv',
  },
  {
    id: 'ozzy',
    name: 'Ozzy',
    color: 'green',
    unlock: 'exodus',
    unlock_lvl: 2,
    icon: IconProng,
    image: iconOzzy,
    discord_level_image: ':CIFI_EXPHuntOzzy:',
    statsModule: () => import('./ozzy'),
    buildRepositoryCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuTy7CSusoWz8YNaIhuWJ5QWzOmbt62BQREuwJns96O9GEHuxPW6q47t4-o51m-og4Vn7yvxeqFRFE/pub?gid=1962166291&single=true&output=csv',
  },
  {
    id: 'knox',
    name: 'Knox',
    color: 'blue',
    unlock: 'exodus',
    unlock_lvl: 4,
    icon: IconAnchor,
    image: iconKnox,
    discord_level_image: ':CIFI_EXPHuntKnox:',
    statsModule: () => import('./knox'),
    buildRepositoryCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuTy7CSusoWz8YNaIhuWJ5QWzOmbt62BQREuwJns96O9GEHuxPW6q47t4-o51m-og4Vn7yvxeqFRFE/pub?gid=680484628&single=true&output=csv',
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