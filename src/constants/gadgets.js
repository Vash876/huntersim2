/**
 * Konstanten für die Gadgets
 * @type {Array<{id: string, label: string, boost: string}>}
 */
export const GADGETS = [
  { id: 'g1', label: 'Handheld Sonic Scansys-4000', boost: 'All Gens, RP' },
  { id: 'g2', label: 'Portable Mini MK1 Generator', boost: 'Cells, RP' },
  { id: 'g3', label: 'Flergonator Navigator', boost: 'Cells, MP, Shards' },
  { id: 'g4', label: 'Serpents Connection Band', boost: 'Orbs' },
  { id: 'wrench', label: 'The Wrench of Gore', boost: 'Borge' },
  { id: 'zaptron', label: 'Zaptron-533 Bio-Repair Tool', boost: 'Ozzy' },
  { id: 'g7', label: 'Academy Upgraded Standard Issue Double Barrel Module', boost: 'AP' },
  { id: 'g8', label: 'Heavy-Duty Auto Extractor-Drill', boost: 'Mats' },
  { id: 'g9', label: 'Anti-Bricking Assistance Device', boost: 'Loop Req' },
  { id: 'g10', label: 'Chad\'s Custom Tokenium Storage Unit', boost: 'Tokens' },
  { id: 'g11', label: 'Pocket-Dimension Petri Dish', boost: 'Cells' },
  { id: 'g12', label: 'Local Fragment Magnet', boost: 'Farm Fragments' },
  { id: 'g13', label: 'Mech Engineer Tool-Pants', boost: 'Mech Cap' },
  { id: 'g14', label: 'Galactic Fragment Magnet', boost: 'Campaign Fragments' },
  { id: 'anchor', label: 'The Anchor of Ages', boost: 'Knox' }
];

/**
 * Hilfsfunktion zum Abrufen eines Gadgets anhand seiner ID
 * @param {string} id - Die ID des Gadgets
 * @returns {Object|null} - Das gefundene Gadget oder null
 */
export function getGadgetById(id) {
  return GADGETS.find(gadget => gadget.id === id) || null;
}

/**
 * Konvertiert eine Gadget-ID in ein Label
 * @param {string} id - Die ID des Gadgets
 * @returns {string} - Das Label des Gadgets oder die ID, falls nicht gefunden
 */
export function getGadgetLabel(id) {
  const gadget = getGadgetById(id);
  return gadget ? gadget.label : id;
}