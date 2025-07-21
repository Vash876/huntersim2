/**
 * TR Tracking Import/Export Utilities
 * Handles encoding/decoding of TR track data for sharing between users
 */

import { Base58 } from '@/utils/base58';

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

  // Create the complete export data
  const exportData = {
    v: EXPORT_VERSION,
    r: testResources,
    t: testTracks
  };

  // Encode to Base58
  const jsonString = JSON.stringify(exportData);
  return Base58.encode(jsonString);
}
