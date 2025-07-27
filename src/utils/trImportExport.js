/**
 * TR Tracking Import/Export Utilities
 * Handles encoding/decoding of TR track data for sharing between users
 */

import { Base58 } from '@/utils/base58';
import { getGemDataFromLocalStorage } from '@/utils/gemDataUtils';
import { convertBoostDataToIds, convertBoostDataFromIds, allBoosts } from '@/constants/tr-planner';

// Version for future compatibility
const EXPORT_VERSION = 1;

// Data compression helpers
function compressTrackData(track) {
  // Create a minimal representation of the track data
  const compressed = {
    v: EXPORT_VERSION, // version
    n: track.name, // name
    s: track.startDate, // start date
    e: track.endDate || null, // end date (if completed)
    a: track.isActive, // is active
    r: track.resourceOrder || [], // resource order
    tc: track.trCount || null, // TR count
    iv: track.initialValues || null, // initial values
    tg: track.targetGoals || null, // target goals
    entries: track.entries.map(entry => ({
      d: entry.date, // date
      v: entry.values, // values object
      n: entry.notes || '' // notes
    }))
  };
  
  return compressed;
}

function decompressTrackData(compressed) {
  // Convert compressed format back to full track object
  return {
    name: compressed.n,
    startDate: compressed.s,
    endDate: compressed.e,
    isActive: compressed.a,
    resourceOrder: compressed.r || [],
    trCount: compressed.tc || null,
    initialValues: compressed.iv || null,
    targetGoals: compressed.tg || null,
    entries: compressed.entries.map(entry => ({
      date: entry.d,
      values: entry.v,
      notes: entry.n || ''
    }))
  };
}

/**
 * Export a TR track to a shareable Base58 string
 * @param {Object} track - The TR track object to export
 * @returns {string} - Base58 encoded track data
 */
export function exportTrack(track) {
  try {
    // Compress and stringify the track data
    const compressed = compressTrackData(track);
    const jsonString = JSON.stringify(compressed);
    
    // Encode to Base58
    const encoded = Base58.encode(jsonString);
    
    return encoded;
  } catch (error) {
    console.error('Error exporting track:', error);
    throw new Error('Failed to export track data');
  }
}

/**
 * Import a TR track from a Base58 string
 * @param {string} encodedData - Base58 encoded track data
 * @returns {Object} - Decoded TR track object
 */
export function importTrack(encodedData) {
  try {
    // Decode from Base58
    const jsonString = Base58.decode(encodedData);
    const compressed = JSON.parse(jsonString);
    
    // Validate version
    if (!compressed.v || compressed.v > EXPORT_VERSION) {
      throw new Error('Unsupported export format version');
    }
    
    // Decompress track data
    const track = decompressTrackData(compressed);
    
    // Validate required fields
    if (!track.name || !track.startDate || !Array.isArray(track.entries)) {
      throw new Error('Invalid track data format');
    }
    
    return track;
  } catch (error) {
    console.error('Error importing track:', error);
    if (error.message.includes('Invalid character') || error.message.includes('Unexpected token')) {
      throw new Error('Invalid import code format');
    }
    throw error;
  }
}

/**
 * Export multiple TR tracks to a shareable Base58 string
 * @param {Array} tracks - Array of TR track objects to export
 * @param {Array} selectedResources - Array of selected resources
 * @returns {string} - Base58 encoded tracks data
 */
export function exportTracks(tracks, selectedResources = []) {
  try {
    const exportData = {
      v: EXPORT_VERSION,
      r: selectedResources, // include resource definitions
      t: tracks.map(track => compressTrackData(track))
    };
    
    const jsonString = JSON.stringify(exportData);
    const encoded = Base58.encode(jsonString);
    
    return encoded;
  } catch (error) {
    console.error('Error exporting tracks:', error);
    throw new Error('Failed to export tracks data');
  }
}

/**
 * Import multiple TR tracks from a Base58 string
 * @param {string} encodedData - Base58 encoded tracks data
 * @returns {Object} - Object containing tracks and resources
 */
export function importTracks(encodedData) {
  try {
    const jsonString = Base58.decode(encodedData);
    const exportData = JSON.parse(jsonString);
    
    // Validate version
    if (!exportData.v || exportData.v > EXPORT_VERSION) {
      throw new Error('Unsupported export format version');
    }
    
    // Decompress tracks
    const tracks = exportData.t.map(compressed => decompressTrackData(compressed));
    const resources = exportData.r || [];
    
    return {
      tracks,
      resources
    };
  } catch (error) {
    console.error('Error importing tracks:', error);
    if (error.message.includes('Invalid character') || error.message.includes('Unexpected token')) {
      throw new Error('Invalid import code format');
    }
    throw error;
  }
}

/**
 * Validate if a string could be a valid import code
 * @param {string} code - The code to validate
 * @returns {boolean} - True if the code looks valid
 */
export function validateImportCode(code) {
  if (!code || typeof code !== 'string') {
    return false;
  }
  
  // Check if it contains only valid Base58 characters
  const base58Regex = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
  return base58Regex.test(code.trim());
}

/**
 * Get a preview of imported data without actually importing it
 * @param {string} encodedData - Base58 encoded data
 * @returns {Object} - Preview information
 */
export function previewImport(encodedData) {
  try {
    const jsonString = Base58.decode(encodedData);
    const data = JSON.parse(jsonString);
    
    // Check if it's single track or multiple tracks
    if (data.t && Array.isArray(data.t)) {
      // Multiple tracks format
      return {
        type: 'multiple',
        count: data.t.length,
        tracks: data.t.map(t => ({
          name: t.n,
          entriesCount: t.entries?.length || 0,
          isActive: t.a
        })),
        resourcesCount: data.r?.length || 0
      };
    } else if (data.n && data.entries) {
      // Single track format
      return {
        type: 'single',
        name: data.n,
        entriesCount: data.entries?.length || 0,
        isActive: data.a
      };
    } else {
      throw new Error('Unknown data format');
    }
  } catch (error) {
    throw new Error('Invalid import code');
  }
}

/**
 * Generate a custom TR plan with specific goals
 * @returns {string} - Base58 encoded TR plan with custom goals
 */
export function generateCustomTRPlan() {
  // Sample resources that match the app's default resources
  const testResources = [
    { id: 'hours-in-tr', name: 'Hours in TR', color: '#888888ff', category: 'main' },
    { id: 'cells', name: 'Cells', color: '#00b90fff', category: 'resources' },
    { id: 'mp', name: 'MP', color: '#ff0000ff', category: 'resources' },
    { id: 'mp-accum', name: 'MP Accum', color: '#ff6666ff', category: 'resources' },
    { id: 'shards', name: 'Shards', color: '#00d9ffff', category: 'resources' },
    { id: 'rp', name: 'RP', color: '#ffa600ff', category: 'resources' },
    { id: 'ap', name: 'AP', color: '#2600ffff', category: 'resources' },
    { id: 'oo-accum', name: 'OO (Accum)', color: '#9f40ffff', category: 'resources' }
  ];

  // Create a realistic TR plan starting 15 days ago
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 15);
  startDate.setHours(9, 0, 0, 0); // Start at 9 AM

  const entries = [];
  
  // Initial values
  const initialValues = {
    'hours-in-tr': 0,
    'cells': 2500,
    'mp': 1200,
    'mp-accum': 3800,
    'shards': 180,
    'rp': 120,
    'ap': 45,
    'oo-accum': 0.8e15 // Start with 800qa
  };

  // Target goals - OO: 15t, Cells: 75000, MP: 6200, RP: 4600, M0: 187
  // M0 187 requires approximately 29,500 shards (calculated from m0 cost formula)
  const targetGoals = {
    ooGoal: 15e15, // 15t (15 trillion)
    cellsGoal: 75000,
    mpGoal: 6200,
    rpGoal: 4600,
    m0Goal: 187
  };

  // Final values - goals achieved except 2 (MP and M0 will be slightly short)
  const finalValues = {
    'oo-accum': 15.2e15, // 15.2t - OO goal REACHED
    'cells': 76500, // 76,500 - Cells goal REACHED  
    'mp': 5950, // 5,950 - MP goal NOT REACHED (250 short)
    'rp': 4750, // 4,750 - RP goal REACHED
    'shards': 28800 // 28,800 shards - M0 goal NOT REACHED (need 29,500 for M0 187)
  };

  // Generate 25 entries with realistic progression
  for (let entryIndex = 0; entryIndex < 25; entryIndex++) {
    const entryDate = new Date(startDate);
    entryDate.setHours(entryDate.getHours() + (entryIndex * 10)); // Every 10 hours
    
    // Progress factor from 0 to 1
    const progress = entryIndex / 24;
    
    // Smooth progression curves for each resource
    const ooProgress = Math.pow(progress, 0.8); // Slightly accelerated growth
    const cellsProgress = Math.pow(progress, 1.2); // Slightly decelerated growth
    const mpProgress = Math.pow(progress, 1.1); // Linear-ish growth
    const mpAccumProgress = Math.pow(progress, 0.9); // Steady growth
    const shardsProgress = Math.pow(progress, 1.0); // Linear growth
    const rpProgress = Math.pow(progress, 0.95); // Slightly accelerated
    const apProgress = Math.pow(progress, 1.15); // Slower start, faster end
    
    // Add some realistic variance (±5%)
    const variance = () => 0.95 + (Math.random() * 0.1);
    
    const values = {
      'hours-in-tr': Math.round((entryIndex + 1) * 7.5 + (Math.random() * 3)), // 7.5-10.5 hours per entry
      'oo-accum': Math.round((initialValues['oo-accum'] + (finalValues['oo-accum'] - initialValues['oo-accum']) * ooProgress) * variance()),
      'cells': Math.round((initialValues.cells + (finalValues.cells - initialValues.cells) * cellsProgress) * variance()),
      'mp': Math.round((initialValues.mp + (finalValues.mp - initialValues.mp) * mpProgress) * variance()),
      'mp-accum': Math.round((initialValues['mp-accum'] + (8500 - initialValues['mp-accum']) * mpAccumProgress) * variance()),
      'shards': Math.round((initialValues.shards + (finalValues.shards - initialValues.shards) * shardsProgress) * variance()),
      'rp': Math.round((initialValues.rp + (finalValues.rp - initialValues.rp) * rpProgress) * variance()),
      'ap': Math.round((initialValues.ap + (650 - initialValues.ap) * apProgress) * variance())
    };
    
    // Add milestone notes at key points
    let notes = '';
    if (entryIndex === 0) {
      notes = 'TR 158 started - targeting 15t OO and multiple goals';
    } else if (entryIndex === 5) {
      notes = 'Early progress - OO accumulation looking good';
    } else if (entryIndex === 10) {
      notes = 'Halfway point - cells goal in sight';
    } else if (entryIndex === 15) {
      notes = 'Strong progress - RP goal achieved!';
    } else if (entryIndex === 20) {
      notes = 'Final stretch - OO and cells goals reached';
    } else if (entryIndex === 24) {
      notes = 'TR complete - 3/5 goals achieved (MP and M0 need more time)';
    }
    
    entries.push({
      d: entryDate.toISOString(),
      v: values,
      n: notes
    });
  }

  // Create the track object with custom goals
  const track = {
    v: EXPORT_VERSION,
    n: `TR 158 - Custom Goals Challenge`,
    s: startDate.toISOString(),
    e: null, // Still active
    a: true, // Active
    r: ['hours-in-tr', 'oo-accum', 'cells', 'mp', 'mp-accum', 'shards', 'rp', 'ap'], // Resource order
    tc: 158, // TR count
    iv: initialValues, // Initial values
    tg: targetGoals, // Target goals
    entries: entries
  };

  // Create single track export data
  const exportData = {
    v: EXPORT_VERSION,
    r: testResources,
    t: [track] // Single track in array
  };

  // Encode to Base58
  const jsonString = JSON.stringify(exportData);
  return Base58.encode(jsonString);
}

/**
 * Generate a single TR plan with goals and 20 entries for testing
 * @returns {string} - Base58 encoded TR plan with goals
 */
export function generateTRPlanWithGoals() {
  // Sample resources that match the app's default resources
  const testResources = [
    { id: 'hours-in-tr', name: 'Hours in TR', color: '#888888ff', category: 'main' },
    { id: 'cells', name: 'Cells', color: '#00b90fff', category: 'resources' },
    { id: 'mp', name: 'MP', color: '#ff0000ff', category: 'resources' },
    { id: 'mp-accum', name: 'MP Accum', color: '#ff6666ff', category: 'resources' },
    { id: 'shards', name: 'Shards', color: '#00d9ffff', category: 'resources' },
    { id: 'rp', name: 'RP', color: '#ffa600ff', category: 'resources' },
    { id: 'ap', name: 'AP', color: '#2600ffff', category: 'resources' }
  ];

  // Create a realistic TR plan starting 10 days ago
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 10);
  startDate.setHours(8, 0, 0, 0); // Start at 8 AM

  const entries = [];
  
  // Initial values
  const initialValues = {
    'hours-in-tr': 0,
    'cells': 1000,
    'mp': 500,
    'mp-accum': 2500,
    'shards': 150,
    'rp': 75,
    'ap': 25
  };

  // Target goals
  const targetGoals = {
    ooGoal: 15,
    m0Goal: 250,
    cellsGoal: 75000,
    mpGoal: 25000,
    rpGoal: 1600
  };

  // Generate 20 entries with realistic progression
  for (let entryIndex = 0; entryIndex < 20; entryIndex++) {
    const entryDate = new Date(startDate);
    entryDate.setHours(entryDate.getHours() + (entryIndex * 12)); // Every 12 hours
    
    // Simulate realistic growth patterns
    const dayProgress = entryIndex / 19; // 0 to 1 over the course of entries
    
    // Different growth patterns for different resources
    const cellsMultiplier = Math.pow(10, dayProgress * 1.8); // Exponential growth for cells
    const mpMultiplier = Math.pow(10, dayProgress * 1.6); // Slightly slower for MP
    const mpAccumMultiplier = Math.pow(2, dayProgress * 3); // Different pattern for MP Accum
    const shardsMultiplier = Math.pow(5, dayProgress * 2); // Moderate growth for shards
    const rpMultiplier = Math.pow(10, dayProgress * 1.4); // Steady growth for RP
    const apMultiplier = Math.pow(4, dayProgress * 1.8); // Good growth for AP
    
    // Add some randomness (±15%)
    const randomFactor = () => 0.85 + (Math.random() * 0.3);
    
    const values = {
      'hours-in-tr': Math.round((entryIndex + 1) * 6 + (Math.random() * 4)), // 6-10 hours per entry
      'cells': Math.round(initialValues.cells * cellsMultiplier * randomFactor()),
      'mp': Math.round(initialValues.mp * mpMultiplier * randomFactor()),
      'mp-accum': Math.round(initialValues['mp-accum'] * mpAccumMultiplier * randomFactor()),
      'shards': Math.round(initialValues.shards * shardsMultiplier * randomFactor()),
      'rp': Math.round(initialValues.rp * rpMultiplier * randomFactor()),
      'ap': Math.round(initialValues.ap * apMultiplier * randomFactor())
    };
    
    // Add milestone notes every 5 entries
    let notes = '';
    if (entryIndex === 0) {
      notes = 'TR started - initial values recorded';
    } else if (entryIndex % 5 === 0) {
      notes = `Day ${Math.floor(entryIndex / 2)} milestone - good progress!`;
    } else if (entryIndex === 10) {
      notes = 'Halfway point reached';
    } else if (entryIndex === 19) {
      notes = 'Final entry - TR nearing completion';
    }
    
    entries.push({
      d: entryDate.toISOString(),
      v: values,
      n: notes
    });
  }

  // Create the track object with goals
  const track = {
    v: EXPORT_VERSION,
    n: `TR 157 - Advanced Goals Plan`,
    s: startDate.toISOString(),
    e: null, // Still active
    a: true, // Active
    r: ['hours-in-tr', 'cells', 'mp', 'mp-accum', 'shards', 'rp', 'ap'], // Resource order
    tc: 157, // TR count
    iv: initialValues, // Initial values
    tg: targetGoals, // Target goals
    entries: entries
  };

  // Create single track export data
  const exportData = {
    v: EXPORT_VERSION,
    r: testResources,
    t: [track] // Single track in array
  };

  // Encode to Base58
  const jsonString = JSON.stringify(exportData);
  return Base58.encode(jsonString);
}

/**
 * Generate test data for development/testing
 * @returns {string} - Base58 encoded test data with 5 TRs and ~20 entries each
 */
export function generateTestData() {
  // Sample resources that match the app's default resources
  const testResources = [
    { id: 'hours-in-tr', name: 'Hours in TR', color: '#888888ff', category: 'main' },
    { id: 'cells', name: 'Cells', color: '#00b90fff', category: 'resources' },
    { id: 'mp', name: 'MP', color: '#ff0000ff', category: 'resources' },
    { id: 'shards', name: 'Shards', color: '#00d9ffff', category: 'resources' },
    { id: 'rp', name: 'RP', color: '#ffa600ff', category: 'resources' },
    { id: 'ap', name: 'AP', color: '#2600ffff', category: 'resources' }
  ];

  // Generate 5 test tracks
  const testTracks = [];
  
  for (let trackIndex = 1; trackIndex <= 5; trackIndex++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (30 * trackIndex)); // Each TR started 30 days apart
    
    const entries = [];
    
    // Generate ~20 entries for each track
    for (let entryIndex = 0; entryIndex < 20; entryIndex++) {
      const entryDate = new Date(startDate);
      entryDate.setHours(entryDate.getHours() + (entryIndex * 12)); // Every 12 hours
      
      // Simulate progressive growth with some randomness
      const baseMultiplier = Math.pow(1.15, entryIndex); // 15% growth per entry
      const randomFactor = 0.8 + (Math.random() * 0.4); // ±20% randomness
      
      const values = {
        'hours-in-tr': Math.round((entryIndex + 1) * 6 + (Math.random() * 4)), // 6-10 hours per entry
        'cells': Math.round(1000 * baseMultiplier * randomFactor),
        'mp': Math.round(500 * baseMultiplier * randomFactor),
        'shards': Math.round(250 * baseMultiplier * randomFactor),
        'rp': Math.round(100 * baseMultiplier * randomFactor),
        'ap': Math.round(50 * baseMultiplier * randomFactor)
      };
      
      entries.push({
        d: entryDate.toISOString(),
        v: values,
        n: entryIndex % 5 === 0 ? `Milestone ${Math.floor(entryIndex/5) + 1}` : '' // Some entries have notes
      });
    }
    
    // Create track with realistic data
    const track = {
      v: EXPORT_VERSION,
      n: `TR ${trackIndex} - Test Data`,
      s: startDate.toISOString(),
      e: trackIndex <= 3 ? new Date(startDate.getTime() + (20 * 24 * 60 * 60 * 1000)).toISOString() : null, // First 3 are completed
      a: trackIndex > 3, // Last 2 are active
      r: ['hours-in-tr', 'cells', 'mp', 'shards', 'rp', 'ap'],
      entries: entries
    };
    
    testTracks.push(track);
  }

  // Encode to Base58
  const jsonString = JSON.stringify(exportData);
  return Base58.encode(jsonString);
}

/**
 * ===========================================
 * TR PLAN IMPORT/EXPORT FUNCTIONALITY
 * ===========================================
 */

// Version for TR Plan exports
const TR_PLAN_EXPORT_VERSION = 1;

/**
 * Pack boolean boost values into a single number using bit manipulation
 * Saves space by encoding multiple booleans as bits in one number
 */
function packBooleans(boostData) {
  let packed = 0n;  // Use BigInt for 33 bits
  for (const [id, value] of Object.entries(boostData)) {
    if (typeof value === 'boolean' && value === true) {
      const bitPosition = parseInt(id) - 1; // IDs start at 1, bits at 0
      if (bitPosition >= 0 && bitPosition < 33) { // Max 33 booleans (IDs 1-33)
        packed |= (1n << BigInt(bitPosition));
      }
    }
  }
  return packed > 0n ? Number(packed) : null;  // Convert back to Number if possible
}

/**
 * Unpack boolean values from a packed number
 */
function unpackBooleans(packedValue) {
  const booleans = {};
  if (!packedValue) return booleans;
  
  const packed = BigInt(packedValue);  // Convert to BigInt for operations
  for (let i = 0; i < 33; i++) { // Changed from 32 to 33 to handle ID 33 (vb5)
    if (packed & (1n << BigInt(i))) {
      booleans[i + 1] = true; // Convert back to 1-based IDs
    }
  }
  return booleans;
}

/**
 * Compress gem data (levels and active nodes) to only non-zero/active values
 */
function compressGemLevels(gemData) {
  const compressed = {};
  
  // Map gem names to short codes
  const gemCodes = {
    'attraction': 'a',
    'innovation': 'i',
    'temporal': 't',
    'power': 'p',
    'exodus': 'e',
    'creation': 'c'
  };
  
  // Compress gem levels
  if (gemData && typeof gemData === 'object') {
    // Handle both old format (just levels) and new format (levels + activeNodes)
    const levels = gemData.levels || gemData;
    
    for (const [gemName, level] of Object.entries(levels)) {
      if (level > 0) {
        const code = gemCodes[gemName];
        if (code) {
          compressed[code] = level;
        }
      }
    }
    
    // Compress active nodes
    if (gemData.activeNodes) {
      const nodeCompressed = {};
      for (const [gemName, nodeArray] of Object.entries(gemData.activeNodes)) {
        if (Array.isArray(nodeArray) && nodeArray.length > 0) {
          const code = gemCodes[gemName];
          if (code) {
            nodeCompressed[code] = nodeArray;
          }
        }
      }
      
      if (Object.keys(nodeCompressed).length > 0) {
        compressed.n = nodeCompressed;
      }
    }
  }
  
  return Object.keys(compressed).length > 0 ? compressed : null;
}

/**
 * Decompress gem data (levels and active nodes) from short codes
 */
function decompressGemLevels(compressedGems) {
  if (!compressedGems) return {};
  
  const gemCodes = {
    'a': 'attraction',
    'i': 'innovation', 
    't': 'temporal',
    'p': 'power',
    'e': 'exodus',
    'c': 'creation'
  };
  
  const result = {
    levels: {},
    activeNodes: {}
  };
  
  // Decompress gem levels
  for (const [code, value] of Object.entries(compressedGems)) {
    if (code === 'n') {
      // Handle active nodes
      if (typeof value === 'object') {
        for (const [nodeCode, nodeArray] of Object.entries(value)) {
          const gemName = gemCodes[nodeCode];
          if (gemName && Array.isArray(nodeArray)) {
            result.activeNodes[gemName] = nodeArray;
          }
        }
      }
    } else {
      // Handle gem levels
      const gemName = gemCodes[code];
      if (gemName && typeof value === 'number') {
        result.levels[gemName] = value;
      }
    }
  }
  
  return result;
}

/**
 * Compress maxed boosts data to compact format
 */
function compressMaxedBoosts(maxedBoosts) {
  if (!maxedBoosts || typeof maxedBoosts !== 'object') return null;
  
  // Map boost keys to short codes for better compression
  const boostCodes = {
    // Milestones
    'ms0': 'm0',
    // Relics
    'r1': 'r1',
    'r2': 'r2',
    'r3': 'r3',
    'r4': 'r4',
    'r5': 'r5',
    'r6': 'r6',
    'r7': 'r7',
    'r8': 'r8',
    'r9': 'r9',
    'r10': 'r10',
    'r11': 'r11',
    'r12': 'r12',
    'r13': 'r13',
    'r14': 'r14',
    'r15': 'r15',
    'r16': 'r16',
    'r17': 'r17',
    'r18': 'r18',
    'r19': 'r19',
    'r20': 'r20',
    // Boolean boosts
    'campfragdet': 'cfd',
    'research_alltime': 'r89',
    'ouroinstalls': 'oi',
    'vb1': 'vb1',
    'vb2': 'vb2',
    'vb3': 'vb3',
    'vb4': 'vb4',
    'vb5': 'vb5',
    'vb6': 'vb6',
    'vb7': 'vb7',
    'vb8': 'vb8',
    'vb9': 'vb9',
    'vb10': 'vb10',
    'vb11': 'vb11',
    'vb12': 'vb12',
    'vb13': 'vb13',
    'vb14': 'vb14',
    'vb15': 'vb15',
    'vb16': 'vb16',
    'vb17': 'vb17',
    'vb18': 'vb18',
    'vb19': 'vb19',
    'vb20': 'vb20',
    // Inscryptions
    'i1': 'i1',
    'i2': 'i2',
    'i3': 'i3',
    'i4': 'i4',
    'i5': 'i5',
    'i6': 'i6',
    'i7': 'i7',
    'i8': 'i8',
    'i9': 'i9',
    'i10': 'i10',
    'i11': 'i11',
    'i12': 'i12',
    'i13': 'i13',
    'i14': 'i14',
    'i15': 'i15',
    'i16': 'i16',
    'i17': 'i17',
    'i18': 'i18',
    'i19': 'i19',
    'i20': 'i20',
    // Gadgets
    'gadgetCloningVats': 'gcv',
    'gadgetTimelord': 'gtl',
    'gadgetAttackedBadges': 'gab',
    'gadgetFragmentFormulas': 'gff',
    'gadgetLootProcessors': 'glp',
    'gadgetDeathsight': 'gds',
    'gadgetLoopOrders': 'glo',
    'gadgetUpgrades': 'gup',
    'gadgetCampaignTokens': 'gct',
    'gadgetTechTreeMemory': 'gtt',
    'gadgetOrbChambers': 'goc',
    'gadgetFragmentDatabase': 'gfd',
    'gadgetBoomHarvesting': 'gbh',
    'gadgetMapProjector': 'gmp',
    'gadgetEventualOrbs': 'geo',
    'gadgetPermenantCounting': 'gpc',
    'gadgetSlaying': 'gsl',
    'gadgetMapFilter': 'gmf',
    'gadgetLoopBuddies': 'glb',
    'gadgetBeacons': 'gbe',
    // Boons
    'boonELevel': 'bel',
    'boonHLevel': 'bhl'
  };
  
  const compressed = {};
  
  // Only include boosts that are actually maxed (true value)
  for (const [boostKey, isMaxed] of Object.entries(maxedBoosts)) {
    if (isMaxed === true) {
      const code = boostCodes[boostKey] || boostKey; // fallback to original key if no mapping
      compressed[code] = 1; // Use 1 instead of true for shorter JSON
    }
  }
  
  return Object.keys(compressed).length > 0 ? compressed : null;
}

/**
 * Decompress maxed boosts data from compact format
 */
function decompressMaxedBoosts(compressedMaxed) {
  if (!compressedMaxed || typeof compressedMaxed !== 'object') return {};
  
  // Reverse mapping from codes to boost keys
  const codeToBoost = {
    // Milestones
    'm0': 'ms0',
    'm1': 'ms1',
    'm2': 'ms2',
    'm3': 'ms3',
    'm4': 'ms4',
    'm5': 'ms5',
    'm6': 'ms6',
    'm7': 'ms7',
    'm8': 'ms8',
    'm9': 'ms9',
    'm10': 'ms10',
    'm11': 'ms11',
    'm12': 'ms12',
    // Relics
    'r1': 'r1',
    'r2': 'r2',
    'r3': 'r3',
    'r4': 'r4',
    'r5': 'r5',
    'r6': 'r6',
    'r7': 'r7',
    'r8': 'r8',
    'r9': 'r9',
    'r10': 'r10',
    'r11': 'r11',
    'r12': 'r12',
    'r13': 'r13',
    'r14': 'r14',
    'r15': 'r15',
    'r16': 'r16',
    'r17': 'r17',
    'r18': 'r18',
    'r19': 'r19',
    'r20': 'r20',
    // Boolean boosts
    'cfd': 'campfragdet',
    'r89': 'research89',
    'oi': 'ouroinstalls',
    'vb1': 'vb1',
    'vb2': 'vb2',
    'vb3': 'vb3',
    'vb4': 'vb4',
    'vb5': 'vb5',
    'vb6': 'vb6',
    'vb7': 'vb7',
    'vb8': 'vb8',
    'vb9': 'vb9',
    'vb10': 'vb10',
    'vb11': 'vb11',
    'vb12': 'vb12',
    'vb13': 'vb13',
    'vb14': 'vb14',
    'vb15': 'vb15',
    'vb16': 'vb16',
    'vb17': 'vb17',
    'vb18': 'vb18',
    'vb19': 'vb19',
    'vb20': 'vb20',
    // Inscryptions
    'i1': 'i1',
    'i2': 'i2',
    'i3': 'i3',
    'i4': 'i4',
    'i5': 'i5',
    'i6': 'i6',
    'i7': 'i7',
    'i8': 'i8',
    'i9': 'i9',
    'i10': 'i10',
    'i11': 'i11',
    'i12': 'i12',
    'i13': 'i13',
    'i14': 'i14',
    'i15': 'i15',
    'i16': 'i16',
    'i17': 'i17',
    'i18': 'i18',
    'i19': 'i19',
    'i20': 'i20',
    // Gadgets
    'gcv': 'gadgetCloningVats',
    'gtl': 'gadgetTimelord',
    'gab': 'gadgetAttackedBadges',
    'gff': 'gadgetFragmentFormulas',
    'glp': 'gadgetLootProcessors',
    'gds': 'gadgetDeathsight',
    'glo': 'gadgetLoopOrders',
    'gup': 'gadgetUpgrades',
    'gct': 'gadgetCampaignTokens',
    'gtt': 'gadgetTechTreeMemory',
    'goc': 'gadgetOrbChambers',
    'gfd': 'gadgetFragmentDatabase',
    'gbh': 'gadgetBoomHarvesting',
    'gmp': 'gadgetMapProjector',
    'geo': 'gadgetEventualOrbs',
    'gpc': 'gadgetPermenantCounting',
    'gsl': 'gadgetSlaying',
    'gmf': 'gadgetMapFilter',
    'glb': 'gadgetLoopBuddies',
    'gbe': 'gadgetBeacons',
    // Boons
    'bel': 'boonELevel',
    'bhl': 'boonHLevel'
  };
  
  const result = {};
  
  console.log('Decompressing maxed boosts - input:', compressedMaxed);
  console.log('Code to boost mapping table available codes:', Object.keys(codeToBoost));
  
  for (const [code, value] of Object.entries(compressedMaxed)) {
    const boostKey = codeToBoost[code] || code; // fallback to original code if no mapping
    console.log(`Decompressing maxed boost: ${code} -> ${boostKey} = ${value}`);
    if (value === 1 || value === true) {
      result[boostKey] = true;
    }
  }
  
  console.log('Decompressed maxed boosts result:', result);
  return result;
}

/**
 * Compress TR Plan data for export (heavily optimized)
 * @param {Object} plan - TR Plan object
 * @param {Object} gemContext - Gem data context for this plan
 * @returns {Object} Compressed plan data
 */
function compressTRPlanData(plan, gemContext = null) {
  // Convert boost data to ID-based format for shorter codes
  const compressedBoosts = plan.boosts ? convertBoostDataToIds(plan.boosts) : {};
  
  // Pack boolean values into a single number using bit manipulation
  const booleanPack = packBooleans(compressedBoosts);
  
  // Remove boolean values from boost data since they're now packed
  const numericBoosts = {};
  for (const [id, value] of Object.entries(compressedBoosts)) {
    if (typeof value === 'number' && value > 0) {
      numericBoosts[id] = value;
    }
  }
  
  // Compress TR Chain data
  let compressedChain = null;
  if (plan.trChain && Array.isArray(plan.trChain) && plan.trChain.length > 0) {
    compressedChain = plan.trChain.map(chainStep => {
      if (!chainStep.boosts) return null;
      
      // Convert chain boosts to ID-based format
      const chainBoosts = convertBoostDataToIds(chainStep.boosts);
      
      // Pack boolean values for chain step
      const chainBooleanPack = packBooleans(chainBoosts);
      
      // Extract numeric boosts for chain step
      const chainNumericBoosts = {};
      for (const [id, value] of Object.entries(chainBoosts)) {
        if (typeof value === 'number' && value > 0) {
          chainNumericBoosts[id] = value;
        }
      }
      
      const chainStep_compressed = {
        b: chainNumericBoosts, // numeric boosts
        bp: chainBooleanPack, // packed boolean values
        s: chainStep.selectedForNextTR && Array.isArray(chainStep.selectedForNextTR) ? chainStep.selectedForNextTR : ['hoursInTR'], // selected for next TR
      };
      
      // Remove empty objects to save space
      Object.keys(chainStep_compressed).forEach(key => {
        if (chainStep_compressed[key] === null || chainStep_compressed[key] === undefined || 
            (typeof chainStep_compressed[key] === 'object' && Object.keys(chainStep_compressed[key]).length === 0)) {
          delete chainStep_compressed[key];
        }
      });
      
      return chainStep_compressed;
    }).filter(step => step !== null);
    
    // Only include chain if it has valid steps
    if (compressedChain.length === 0) {
      compressedChain = null;
    }
  }
  
  // Compress gem context to only essential levels and active nodes
  const compressedGems = gemContext ? compressGemLevels(gemContext) : null;
  console.log('Exporting gem context:', gemContext);
  console.log('Compressed gems for export:', compressedGems);
  
  // Compress maxed boosts (_orbCalcMaxedBoosts)
  let compressedMaxedBoosts = null;
  if (plan.updatedStats?._orbCalcMaxedBoosts) {
    compressedMaxedBoosts = compressMaxedBoosts(plan.updatedStats._orbCalcMaxedBoosts);
    console.log('Exporting maxed boosts:', plan.updatedStats._orbCalcMaxedBoosts);
    console.log('Compressed maxed boosts for export:', compressedMaxedBoosts);
  }
  
  const compressed = {
    v: TR_PLAN_EXPORT_VERSION, // version
    b: numericBoosts, // numeric boosts only
    bp: booleanPack, // packed boolean values
    c: compressedChain, // compressed TR chain
    g: compressedGems, // compressed gem levels
    m: compressedMaxedBoosts, // compressed maxed boosts
    s: plan.selectedForNextTR && Array.isArray(plan.selectedForNextTR) ? plan.selectedForNextTR : ['hoursInTR'], // selected for next TR
    // Plan meta information
    sd: plan.trStartDate, // start date
    st: plan.trStartTime, // start time
    tc: plan.updatedStats?.trCount || 0, // TR count
    ato: plan.updatedStats?.allTimeOrbs || 0, // all time orbs
    // Remove all other unnecessary data for maximum compression
  };
  
  // Remove null/empty values to save space
  Object.keys(compressed).forEach(key => {
    if (compressed[key] === null || compressed[key] === undefined || 
        (typeof compressed[key] === 'object' && Object.keys(compressed[key]).length === 0)) {
      delete compressed[key];
    }
  });
  
  return compressed;
}

/**
 * Decompress TR Plan data from import (optimized version)
 * @param {Object} compressed - Compressed plan data
 * @returns {Object} Full TR Plan object
 */
function decompressTRPlanData(compressed) {
  // Unpack boolean values (handle case where bp might be undefined)
  const unpackedBooleans = compressed.bp ? unpackBooleans(compressed.bp) : {};
  
  // Merge numeric and boolean boost data (handle case where b might be undefined)
  const allBoostData = { ...(compressed.b || {}), ...unpackedBooleans };
  
  // Convert boost data back from ID-based to key-based format
  const rawBoostData = convertBoostDataFromIds(allBoostData);
  
  // Initialize full boost objects with default values for all boosts
  const fullBoostObjects = {};
  
  // First, initialize ALL boosts with default values
  allBoosts.forEach(boost => {
    if (boost.type === 'boolean') {
      fullBoostObjects[boost.key] = {
        type: 'boolean',
        targetState: false,
        label: boost.label || boost.key
      };
    } else if (boost.type === 'number') {
      fullBoostObjects[boost.key] = {
        type: 'number',
        targetLevel: 0,
        label: boost.label || boost.key
      };
    }
  });
  
  // Then override with imported values if they exist
  for (const [boostKey, value] of Object.entries(rawBoostData)) {
    if (fullBoostObjects[boostKey]) {
      if (fullBoostObjects[boostKey].type === 'boolean') {
        fullBoostObjects[boostKey].targetState = !!value;
      } else if (fullBoostObjects[boostKey].type === 'number') {
        fullBoostObjects[boostKey].targetLevel = value;
      }
    }
  }
  
  // Decompress gem context
  const gemData = decompressGemLevels(compressed.g);
  console.log('Compressed gems in import data:', compressed.g);
  console.log('Decompressed gem data:', gemData);
  const gemLevels = gemData.levels || {};
  const gemActiveNodes = gemData.activeNodes || {};
  const gemContext = (Object.keys(gemLevels).length > 0 || Object.keys(gemActiveNodes).length > 0) ? gemData : null;
  
  // Create gem overrides for imported gem levels and nodes that differ from current global state
  let gemOverrides = null;
  if (gemLevels || gemActiveNodes) {
    try {
      // Use the imported function to get current global levels
      const currentGlobalGemData = getGemDataFromLocalStorage();
      const currentGlobalLevels = currentGlobalGemData?.levels || {};
      const currentGlobalActiveNodes = currentGlobalGemData?.activeNodes || {};
      
      const overrides = {};
      
      // Compare each imported gem level with current global level
      Object.entries(gemLevels).forEach(([gemId, importedLevel]) => {
        const currentGlobalLevel = currentGlobalLevels[gemId] || 0;
        
        // If imported level is higher than global, create an override
        if (importedLevel > currentGlobalLevel) {
          overrides[`${gemId}Level`] = importedLevel;
          console.log(`Creating level override for ${gemId}: imported=${importedLevel}, current=${currentGlobalLevel}`);
        }
      });
      
      // Compare each imported gem's active nodes with current global active nodes
      Object.entries(gemActiveNodes).forEach(([gemId, importedNodes]) => {
        const currentGlobalNodes = currentGlobalActiveNodes[gemId] || [];
        
        // Check if imported nodes differ from current global nodes
        const importedNodesSet = new Set(importedNodes);
        const currentNodesSet = new Set(currentGlobalNodes);
        
        // If the sets are different, create overrides for all imported nodes
        const areNodesDifferent = importedNodes.length !== currentGlobalNodes.length ||
                                 importedNodes.some(node => !currentNodesSet.has(node)) ||
                                 currentGlobalNodes.some(node => !importedNodesSet.has(node));
        
        if (areNodesDifferent) {
          importedNodes.forEach(nodeIndex => {
            overrides[`${gemId}Node${nodeIndex}`] = true;
            console.log(`Creating node override for ${gemId}Node${nodeIndex}: imported active, current was ${currentGlobalNodes.includes(nodeIndex) ? 'active' : 'inactive'}`);
          });
          
          // Also need to explicitly set inactive nodes to false if they were active globally but not in import
          currentGlobalNodes.forEach(nodeIndex => {
            if (!importedNodesSet.has(nodeIndex)) {
              overrides[`${gemId}Node${nodeIndex}`] = false;
              console.log(`Creating node override for ${gemId}Node${nodeIndex}: imported inactive, current was active`);
            }
          });
        }
      });
      
      // Only set gemOverrides if there are any overrides needed
      if (Object.keys(overrides).length > 0) {
        gemOverrides = overrides;
        console.log('Created gem overrides for import:', gemOverrides);
      } else {
        console.log('No gem overrides needed - all imported gem data matches current global state');
      }
    } catch (error) {
      console.error('Error creating gem overrides during import:', error);
      // Continue without gem overrides if there's an error
    }
  }
  
  // Decompress maxed boosts data
  const importedMaxedBoosts = compressed.m ? decompressMaxedBoosts(compressed.m) : {};
  console.log('Compressed maxed boosts in import data:', compressed.m);
  console.log('Decompressed maxed boosts:', importedMaxedBoosts);
  
  // Create maxed boosts overrides - similar to gem overrides logic
  let maxedBoostsOverrides = null;
  if (Object.keys(importedMaxedBoosts).length > 0) {
    try {
      // Get current global maxed boosts from localStorage
      const currentStatsJSON = localStorage.getItem('trplanner_userstats');
      const currentStats = currentStatsJSON ? JSON.parse(currentStatsJSON) : {};
      const currentGlobalMaxedBoosts = currentStats._orbCalcMaxedBoosts || {};
      
      const overrides = {};
      
      // Compare each imported maxed boost with current global state
      Object.keys(importedMaxedBoosts).forEach(boostKey => {
        const isImportedMaxed = importedMaxedBoosts[boostKey] === true;
        const isGloballyMaxed = currentGlobalMaxedBoosts[boostKey] === true;
        
        // If there's a difference between imported and global, create an override
        if (isImportedMaxed !== isGloballyMaxed) {
          overrides[boostKey] = isImportedMaxed;
          console.log(`Creating maxed boost override for ${boostKey}: imported=${isImportedMaxed}, current=${isGloballyMaxed}`);
        }
      });
      
      // Also check for boosts that are globally maxed but not in import
      Object.keys(currentGlobalMaxedBoosts).forEach(boostKey => {
        if (currentGlobalMaxedBoosts[boostKey] === true && !importedMaxedBoosts.hasOwnProperty(boostKey)) {
          overrides[boostKey] = false; // Override to not maxed
          console.log(`Creating maxed boost override for ${boostKey}: imported=false, current=true`);
        }
      });
      
      // Only set maxedBoostsOverrides if there are any overrides needed
      if (Object.keys(overrides).length > 0) {
        maxedBoostsOverrides = overrides;
        console.log('Created maxed boosts overrides for import:', maxedBoostsOverrides);
      } else {
        console.log('No maxed boosts overrides needed - all imported data matches current global state');
      }
    } catch (error) {
      console.error('Error creating maxed boosts overrides during import:', error);
      // Continue without maxed boosts overrides if there's an error
    }
  }
  
  // Decompress TR Chain data
  let trChain = [];
  if (compressed.c && Array.isArray(compressed.c)) {
    trChain = compressed.c.map(chainStep => {
      // Unpack boolean values for chain step
      const chainUnpackedBooleans = chainStep.bp ? unpackBooleans(chainStep.bp) : {};
      
      // Merge numeric and boolean boost data for chain step
      const chainAllBoostData = { ...(chainStep.b || {}), ...chainUnpackedBooleans };
      
      // Convert boost data back from ID-based to key-based format
      const chainRawBoostData = convertBoostDataFromIds(chainAllBoostData);
      
      // Initialize full boost objects for chain step
      const chainFullBoostObjects = {};
      
      // First, initialize ALL boosts with default values
      allBoosts.forEach(boost => {
        if (boost.type === 'boolean') {
          chainFullBoostObjects[boost.key] = {
            type: 'boolean',
            targetState: false,
            label: boost.label || boost.key
          };
        } else if (boost.type === 'number') {
          chainFullBoostObjects[boost.key] = {
            type: 'number',
            targetLevel: 0,
            label: boost.label || boost.key
          };
        }
      });
      
      // Then override with imported values if they exist
      for (const [boostKey, value] of Object.entries(chainRawBoostData)) {
        if (chainFullBoostObjects[boostKey]) {
          if (chainFullBoostObjects[boostKey].type === 'boolean') {
            chainFullBoostObjects[boostKey].targetState = !!value;
          } else if (chainFullBoostObjects[boostKey].type === 'number') {
            chainFullBoostObjects[boostKey].targetLevel = value;
          }
        }
      }
      
      return {
        boosts: chainFullBoostObjects,
        results: {}, // Default empty results - will be calculated on import
        selectedForNextTR: chainStep.s && Array.isArray(chainStep.s) ? chainStep.s : ['hoursInTR'] // Restore selectedForNextTR
      };
    });
  }
  
  return {
    name: 'TR Plan Import',
    trStartDate: compressed.sd || new Date().toISOString().split('T')[0], // Use imported date or current date as fallback
    trStartTime: compressed.st || '00:00', // Use imported time or midnight as fallback
    boosts: fullBoostObjects,
    trChain: trChain, // Include the decompressed TR chain
    updatedStats: {
      trCount: compressed.tc || 0, // Use imported TR count
      allTimeOrbs: compressed.ato || 0, // Use imported all time orbs
      _orbCalcMaxedBoosts: importedMaxedBoosts, // Include imported maxed boosts for calculations
    },
    selectedForNextTR: compressed.s && Array.isArray(compressed.s) ? compressed.s : ['hoursInTR'], // Restore selectedForNextTR
    gemOverrides: gemOverrides, // Include gem overrides if needed
    maxedBoostsOverrides: maxedBoostsOverrides, // Include maxed boosts overrides if needed
    progress: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Mark as imported and store original gem context
    isImported: true,
    importedGemContext: gemContext,
    importMeta: {
      version: compressed.v,
      importedAt: new Date().toISOString()
    }
  };
}

/**
 * Export a TR Plan to a shareable Base58 string
 * @param {Object} plan - The TR Plan object to export
 * @param {Object} currentGemData - Current user's gem data to include as context
 * @returns {string} - Base58 encoded plan data
 */
export function exportTRPlan(plan, currentGemData = null) {
  try {
    // Get current gem data if not provided
    if (!currentGemData) {
      // Import here to avoid circular dependency
      const { getGemDataFromLocalStorage } = require('@/utils/gemDataUtils');
      currentGemData = getGemDataFromLocalStorage();
    }
    
    // Compress and stringify the plan data
    const compressed = compressTRPlanData(plan, currentGemData);
    const jsonString = JSON.stringify(compressed);
    
    // Encode to Base58
    const encoded = Base58.encode(jsonString);
    
    return encoded;
  } catch (error) {
    console.error('Error exporting TR plan:', error);
    throw new Error('Failed to export TR plan data');
  }
}

/**
 * Import a TR Plan from a Base58 string
 * @param {string} encodedData - Base58 encoded plan data
 * @returns {Object} - Decoded TR Plan object with import metadata
 */
export function importTRPlan(encodedData) {
  try {
    // Decode from Base58
    const jsonString = Base58.decode(encodedData);
    const compressed = JSON.parse(jsonString);
    
    // Validate version
    if (!compressed.v || compressed.v > TR_PLAN_EXPORT_VERSION) {
      throw new Error('Unsupported TR plan export format version');
    }
    
    // Decompress plan data
    const plan = decompressTRPlanData(compressed);
    
    // Validate required fields
    if (!plan.name || !plan.trStartDate) {
      throw new Error('Invalid TR plan data format');
    }
    
    // Generate new ID for imported plan
    plan.id = `imported_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    plan.name = `${plan.name} (Imported)`;
    
    return {
      plan: plan,
      gemContext: compressed.gc,
      requiresGems: getRequiredGemsForPlan(plan, compressed.gc),
      isCompatible: checkPlanCompatibility(compressed.gc)
    };
  } catch (error) {
    console.error('Error importing TR plan:', error);
    throw new Error('Failed to import TR plan data: ' + error.message);
  }
}

/**
 * Analyze which gems are required for the imported plan
 * @param {Object} plan - Imported plan object
 * @param {Object} importedGemContext - Gem context from import
 * @returns {Object} Required gems analysis
 */
function getRequiredGemsForPlan(plan, importedGemContext) {
  if (!importedGemContext?.levels) return {};
  
  const requirements = {
    innovation: importedGemContext.levels.innovation || 0,
    attraction: importedGemContext.levels.attraction || 0,
    power: importedGemContext.levels.power || 0,
    temporal: importedGemContext.levels.temporal || 0,
    exodus: importedGemContext.levels.exodus || 0,
    creation: importedGemContext.levels.creation || 0
  };
  
  // Filter out gems that are at level 0
  Object.keys(requirements).forEach(key => {
    if (requirements[key] === 0) {
      delete requirements[key];
    }
  });
  
  return requirements;
}

/**
 * Check if the imported plan is compatible with current gem levels
 * @param {Object} importedGemContext - Gem context from import
 * @returns {Object} Compatibility analysis
 */
function checkPlanCompatibility(importedGemContext) {
  if (!importedGemContext?.levels) {
    return { compatible: true, warnings: [] };
  }
  
  const currentGems = getGemDataFromLocalStorage();
  
  const warnings = [];
  let compatible = true;
  
  Object.entries(importedGemContext.levels).forEach(([gemType, requiredLevel]) => {
    const currentLevel = currentGems.levels[gemType] || 0;
    
    if (requiredLevel > currentLevel) {
      compatible = false;
      warnings.push({
        gem: gemType,
        required: requiredLevel,
        current: currentLevel,
        missing: requiredLevel - currentLevel
      });
    }
  });
  
  return { compatible, warnings };
}

// Export utility functions for testing
export { packBooleans, unpackBooleans };
