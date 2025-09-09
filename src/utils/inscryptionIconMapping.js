// Inscryption Icon Mapping
// Maps icon names from CSV to actual image files in src/assets/general/

// Explicit imports for Vite asset handling
import allgenIcon from '../assets/general/allgen.png';
import cellsIcon from '../assets/general/cells.png';
import lpIcon from '../assets/general/lp.png';
import mpIcon from '../assets/general/mp.png';
import shardsIcon from '../assets/general/shards.png';
import lrReductionIcon from '../assets/general/lrReduction.png';
import esotericIcon from '../assets/general/esoteric.png';
import personnelIcon from '../assets/general/Personnel.png';
import fragsIcon from '../assets/general/fragments.png';
import OOIcon from '../assets/general/orbs.png';
import meltdownIcon from '../assets/general/Meltdown.png';
import borgeIcon from '../assets/borge/hunter_small.png'; 
import ozzyIcon from '../assets/ozzy/hunter_small.png'; 
import knoxIcon from '../assets/knox/hunter_small.png'; 
import shipRankIcon from '../assets/general/shipRank.png';
import shipCrewIcon from '../assets/general/shipCrew.png';
import effectIcon from '../assets/general/allgen.png'; // Using allgen.png as fallback instead of effect.PNG

export const INSCRYPTION_ICON_MAPPING = {
  // Gameplay mechanics (case-sensitive mapping for CSV)
  'Meltdown': meltdownIcon,
  'meltdown': meltdownIcon, // Same icon for both cases
  'Cells': cellsIcon, 
  'LP': lpIcon,
  'mp': mpIcon,
  'allgen': allgenIcon,
  'shards': shardsIcon,
  'lrReduction': lrReductionIcon,
  'Esoteric': esotericIcon,
  'Personnel': personnelIcon,
  'frags': fragsIcon,
  'OO': OOIcon,

  // Hunter
  'Borge': borgeIcon,
  'Ozzy': ozzyIcon,
  'Knox': knoxIcon,

  // Ship-related
  'shipRank': shipRankIcon,
  'shipCrew': shipCrewIcon,
  
  // Fallback for unknown icons
  'default': effectIcon
};

/**
 * Get the icon path for an inscryption
 * @param {string} iconName - Icon name from CSV
 * @returns {string} - Path to icon file
 */
export function getInscryptionIcon(iconName) {
  return INSCRYPTION_ICON_MAPPING[iconName] || INSCRYPTION_ICON_MAPPING.default;
}

/**
 * Get icon URL for use in img src
 * @param {string} iconName - Icon name from CSV
 * @returns {string} - Import URL for Vite
 */
export function getInscryptionIconUrl(iconName) {
  return INSCRYPTION_ICON_MAPPING[iconName] || INSCRYPTION_ICON_MAPPING.default;
}
