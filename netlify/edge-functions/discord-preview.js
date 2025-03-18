export default async function handler(request, context) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Discord Bot erkennen
  const isDiscordBot = userAgent.includes('Discordbot') || url.searchParams.has('preview');
  
  // Prüfen, ob es ein Build-Link ist
  if (isDiscordBot && 
      url.pathname.match(/\/[a-zA-Z0-9]+/) && 
      url.searchParams.has('code')) {
    
    // Hunter-ID aus der URL extrahieren
    const hunterId = url.pathname.substring(1);
    const buildCode = url.searchParams.get('code');
    
    // Level aus Code berechnen oder "Invalid Build Code" anzeigen
    const buildInfo = calculateBuildLevel(buildCode, hunterId);
    const levelText = buildInfo.isValid ? `Level ${buildInfo.level}` : 'Invalid Build Code';
    
    // Statische Hunter-Daten
    const hunters = {
      borge: { name: 'Borge', color: '#ef4444' },
      ozzy: { name: 'Ozzy', color: '#22c55e' },
      knox: { name: 'Knox', color: '#3b82f6' }
    };
    
    const hunter = hunters[hunterId] || { name: 'Hunter', color: '#9ca3af' };
    
    // HTML mit Meta-Tags zurückgeben, aber ohne Bild
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hunter Simulator 2 - ${hunter.name} ${levelText}</title>
          <meta property="og:title" content="${hunter.name} ${levelText}" />
          <meta property="og:description" content="Check out this ${hunter.name} build for Hunter Simulator." />
          <meta property="og:url" content="${url.href}" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Hunter Simulator" />
          <meta property="theme-color" content="${hunter.color}" />
          
          <!-- Weiterleitung für normale Browser -->
          <meta http-equiv="refresh" content="0;url=${url.href}">
        </head>
        <body>
          <p>Redirecting to Hunter Simulator...</p>
        </body>
      </html>
    `;
    
    return new Response(html, {
      headers: { 'content-type': 'text/html' },
    });
  }
  
  // Für alle anderen Anfragen: normale Seite anzeigen
  return context.next();
}

// ========== Build-Code Parsing Logik ==========

// Base58-Alphabet für die Codierung
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

// Base58 Decoder erstellen
function generateEncoder(e) {
  const t = new Uint8Array(256);
  for (let c = 0; c < t.length; c++)
      t[c] = 255;
  for (let c = 0; c < e.length; c++) {
      const u = e.charAt(c), f = u.charCodeAt(0);
      t[f] = c;
  }
  const n = e.length, r = e.charAt(0);
  
  function decode(c) {
    if (typeof c != "string") return null;
    if (c.length === 0) return new Uint8Array;
    
    let u = 0, f = 0, p = 0;
    const o = Math.log(256) / Math.log(n);
    
    while (c[u] === r) f++, u++;
    
    const g = (c.length - u) * o + 1 >>> 0;
    const v = new Uint8Array(g);
    
    while (c[u]) {
      const O = t[c.charCodeAt(u)];
      if (O === 255) return null;
      
      let k = 0;
      for (let _ = g - 1; (O !== 0 || k < p) && _ !== -1; _--, k++) {
        O += n * v[_] >>> 0;
        v[_] = O % 256 >>> 0;
        O = O / 256 >>> 0;
      }
      
      p = k;
      u++;
    }
    
    let b = g - p;
    while (b !== g && v[b] === 0) b++;
    
    const S = new Uint8Array(f + (g - b));
    let w = f;
    while (b !== g) S[w++] = v[b++];
    
    return S;
  }

  return { decode };
}

// Code-Handler-Klasse für das Entschlüsseln des Build-Codes
class CodeHandler {
  constructor(kind, version, levels) {
    this.kind = kind;
    this.version = version;
    this.levels = levels;
  }
  
  static fromBuffer(buffer) {
    if (!buffer || buffer.length < 2 || buffer[0] !== 101) return null;
    
    const kind = buffer[1] >> 5;
    const version = buffer[1] & 7;
    const levels = [];
    let pos = 2;
    
    const processControlType = (type) => {
      if (type < 2) {
        levels.push(type);
      } else if (type === 2 && pos < buffer.length) {
        levels.push(buffer[pos++] & 255);
      } else if (pos + 1 < buffer.length) {
        levels.push(((buffer[pos++] & 255) << 8) | (buffer[pos++] & 255));
      }
    };
    
    while (pos < buffer.length) {
      const controlByte = buffer[pos++] & 255;
      processControlType(controlByte >> 6); // First 2 bits
      processControlType((controlByte >> 4) & 3); // Next 2 bits
      processControlType((controlByte >> 2) & 3); // Next 2 bits
      processControlType(controlByte & 3); // Last 2 bits
    }
    
    return new CodeHandler(kind, version, levels);
  }
  
  static fromCode(code) {
    try {
      const encoder = generateEncoder(BASE58_ALPHABET);
      return CodeHandler.fromBuffer(encoder.decode(code));
    } catch (e) {
      return null;
    }
  }
}

// Parameter-Positionen für die Level-Berechnung
const TALENT_INDICES = {
  'borge': [0, 1, 2, 3, 4, 5, 6, 7, 56],
  'ozzy':  [0, 1, 2, 3, 4, 5, 6, 7, 41],
  'knox':  [0, 1, 2, 3, 4, 5, 6, 7, 8]
};

// Build-Level berechnen
function calculateBuildLevel(code, hunterId) {
  try {
    // Versuchen, den Code zu decodieren
    const data = CodeHandler.fromCode(code);
    
    if (!data || !data.levels || !data.levels.length) {
      return { isValid: false, level: 0 };
    }
    
    // Die Indizes für den Hunter-Typ abrufen
    const talentIndices = TALENT_INDICES[hunterId] || TALENT_INDICES.borge;
    
    // Talent-Punkte summieren (dies ist das Level)
    let talentSum = 0;
    for (const index of talentIndices) {
      if (index < data.levels.length) {
        talentSum += data.levels[index] || 0;
      }
    }
    
    // Level einfach als Summe der Talent-Punkte zurückgeben
    return { 
      isValid: true, 
      level: talentSum || 1 // Mindestens Level 1
    };
  } catch (error) {
    return { isValid: false, level: 0 };
  }
}