/**
 * Track Code Compression Utility
 * Uses pako (zlib deflate) for compression when beneficial.
 * Automatically picks the shorter encoding between plain base64 and pako.
 * v2 = plain base64 JSON (short keys), v3 = pako compressed
 * Imports of old v1/v2 codes remain fully supported.
 */
import pako from 'pako';

/**
 * Build the ultra-compact JSON representation used by both encoders.
 */
function buildCompact(track) {
  return {
    n: track.name,
    s: track.startDate,
    nt: track.notes || '',
    t: track.trCount,
    g: track.targetGoals || {},
    i: track.initialValues || {},
    e: (track.entries || []).map(entry => [
      entry.date,
      entry.values,
      entry.notes || '',
      entry.id
    ]),
    r: track.selectedResources || [],
    o: track.resourceOrder || [],
    a: track.isActive ? 1 : 0,
    c: track.createdAt,
    u: track.updatedAt
  };
}

/**
 * Compress a track object into a compact share code string.
 * Tries pako deflate and plain base64, picks whichever is shorter.
 */
export function compressTrack(track) {
  const compact = buildCompact(track);
  const jsonStr = JSON.stringify(compact);

  // Method A: plain base64 (v2) — same as before
  const plainB64 = btoa(JSON.stringify({ ...compact, v: '2' }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  // Method B: pako deflateRaw + base64 (v3)
  let pakoB64;
  try {
    const deflated = pako.deflateRaw(new TextEncoder().encode(jsonStr), { level: 9 });
    const binStr = Array.from(deflated, byte => String.fromCharCode(byte)).join('');
    pakoB64 = 'Z' + btoa(binStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    // 'Z' prefix distinguishes pako codes from plain base64
  } catch {
    pakoB64 = null;
  }

  // Pick the shorter one
  if (pakoB64 && pakoB64.length < plainB64.length) {
    return pakoB64;
  }
  return plainB64;
}

/**
 * Decompress a share code string back into a track object.
 * Supports v1, v2 (plain base64), v3 (pako with 'Z' prefix),
 * and legacy v3 (pako without prefix) formats.
 */
export function decompressTrack(code) {
  if (!code || typeof code !== 'string') return null;
  
  code = code.trim();
  if (!code) return null;

  let compressed;

  // 'Z' prefix = pako deflateRaw compressed
  if (code.startsWith('Z')) {
    try {
      let b64 = code.slice(1).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const binStr = atob(b64);
      const bytes = Uint8Array.from(binStr, c => c.charCodeAt(0));
      const inflated = pako.inflateRaw(bytes, { to: 'string' });
      compressed = JSON.parse(inflated);
      // Mark as v3 for the parser below
      if (!compressed.v) compressed.v = '3';
    } catch {
      return null;
    }
  } else {
    // Restore URL-safe base64 and add padding
    let base64Code = code.replace(/-/g, '+').replace(/_/g, '/');
    while (base64Code.length % 4) base64Code += '=';

    // Try pako inflate first (legacy v3 without prefix)
    try {
      const binStr = atob(base64Code);
      const bytes = Uint8Array.from(binStr, c => c.charCodeAt(0));
      const inflated = pako.inflate(bytes, { to: 'string' });
      compressed = JSON.parse(inflated);
    } catch {
      // Fallback: plain base64 JSON (v1/v2)
      try {
        compressed = JSON.parse(atob(base64Code));
      } catch {
        return null;
      }
    }
  }

  // Decompress based on version
  let track;

  if (compressed.v === '3' || compressed.v === '2') {
    track = {
      name: compressed.n,
      startDate: compressed.s,
      notes: compressed.nt || '',
      trCount: compressed.t,
      targetGoals: compressed.g || {},
      initialValues: compressed.i || {},
      entries: (compressed.e || []).map(entryArray => ({
        date: entryArray[0],
        values: entryArray[1],
        notes: entryArray[2] || '',
        id: entryArray[3]
      })),
      selectedResources: compressed.r || [],
      resourceOrder: compressed.o || [],
      isActive: compressed.a === 1,
      createdAt: compressed.c,
      updatedAt: compressed.u,
      version: compressed.v
    };
  } else if (compressed.n && compressed.sd) {
    // Old compressed format - version 1
    track = {
      name: compressed.n,
      startDate: compressed.sd,
      notes: compressed.nt || '',
      trCount: compressed.tc,
      targetGoals: compressed.tg || {},
      initialValues: compressed.iv || {},
      entries: (compressed.e || []).map(entry => ({
        date: entry.d,
        values: entry.v,
        notes: entry.n,
        id: entry.i
      })),
      selectedResources: compressed.sr || [],
      resourceOrder: compressed.ro || [],
      isActive: compressed.a,
      createdAt: compressed.ca,
      updatedAt: compressed.ua,
      version: compressed.ver || '1.0'
    };
  } else {
    // Original uncompressed format
    track = compressed;
  }

  // Validate required fields
  if (!track.name || !track.startDate || !track.trCount) {
    return null;
  }

  return track;
}
