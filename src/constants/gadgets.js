/**
 * Konstanten für die Gadgets
 * @type {Array<{id: string, label: string}>}
 */
export const GADGETS = [
  { id: 'g1', label: 'Handheld Sonic Scansys-4000' },
  { id: 'g2', label: 'Portable Mini MK1 Generator' },
  { id: 'g3', label: 'Flergonator Navigator' },
  { id: 'g4', label: 'Serpents Connection Band' },
  { id: 'wrench', label: 'The Wrench of Gore' },
  { id: 'zaptron', label: 'Zaptron-533 Bio-Repair Tool' },
  { id: 'g7', label: 'Academy Upgraded Standard Issue Double Barrel Module' },
  { id: 'g8', label: 'Heavy-Duty Auto Extractor-Drill' },
  { id: 'g9', label: 'Anti-Bricking Assistance Device' },
  { id: 'g10', label: 'Chad\'s Custom Tokenium Storage Unit' },
  { id: 'g11', label: 'Pocket-Dimension Petri Dish' },
  { id: 'g12', label: 'Local Fragment Magnet' },
  { id: 'g13', label: 'Mech Engineer Tool-Pants' },
  { id: 'g14', label: 'Galactic Fragment Magnet' },
  { id: 'anchor', label: 'The Anchor of Ages' }
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