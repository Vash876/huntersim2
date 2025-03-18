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

// Alternatives Base58-Decoding, speziell für Build-Codes
function decodeBase58(str) {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const base = ALPHABET.length;
  
  // Decoding-Tabelle
  const lookup = {};
  for (let i = 0; i < ALPHABET.length; i++) {
    lookup[ALPHABET[i]] = i;
  }

  // Konvertieren des Strings in Zahlen
  let bytes = [0];
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (lookup[c] === undefined) {
      return null;
    }
    let carry = lookup[c];
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * base;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  // Führende Nullen
  for (let i = 0; i < str.length && str[i] === '1'; i++) {
    bytes.push(0);
  }

  return new Uint8Array(bytes.reverse());
}

// Code-Handler-Klasse für das Entschlüsseln des Build-Codes
class CodeHandler {
  constructor(kind, version, levels) {
    this.kind = kind;
    this.version = version;
    this.levels = levels;
  }
  
  static fromBuffer(buffer) {
    try {
      if (!buffer || buffer.length < 2) return null;
      
      // Die ersten beiden Bytes sind die Header-Bytes
      // 101 ist der Magic-Value für Build-Codes
      const magicByte = buffer[0];
      
      // Wenn der Magic-Byte falsch ist, können wir es trotzdem versuchen
      // Dies erhöht die Chance, dass der Code korrekt dekodiert wird
      
      const kindVersionByte = buffer[1];
      const kind = kindVersionByte >> 5;
      const version = kindVersionByte & 7;
      
      const levels = [];
      let pos = 2;
      
      // Daten aus dem Buffer lesen
      while (pos < buffer.length) {
        const controlByte = buffer[pos++];
        
        // 4 Control-Typen pro Byte
        for (let i = 6; i >= 0; i -= 2) {
          if (pos >= buffer.length) break;
          
          const type = (controlByte >> i) & 3;
          
          if (type === 0 || type === 1) {
            // Direkte Werte 0 oder 1
            levels.push(type);
          } else if (type === 2) {
            // 1-Byte-Wert
            if (pos < buffer.length) {
              levels.push(buffer[pos++]);
            }
          } else if (type === 3) {
            // 2-Byte-Wert
            if (pos + 1 < buffer.length) {
              const value = (buffer[pos++] << 8) | buffer[pos++];
              levels.push(value);
            }
          }
        }
      }
      
      return new CodeHandler(kind, version, levels);
    } catch (e) {
      // Bei Fehlern null zurückgeben
      return null;
    }
  }
  
  static fromCode(code) {
    try {
      const buffer = decodeBase58(code);
      return this.fromBuffer(buffer);
    } catch (e) {
      return null;
    }
  }
}

// Parameter-Positionen für die Level-Berechnung (Talent-Indizes)
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
    
    // Talent-Punkte summieren
    let talentSum = 0;
    for (const index of talentIndices) {
      if (index < data.levels.length) {
        talentSum += (data.levels[index] || 0);
      }
    }
    
    // Level einfach als Summe der Talent-Punkte zurückgeben
    // Wenn keine Punkte gefunden wurden, Level 1 zurückgeben
    return { 
      isValid: true, 
      level: talentSum > 0 ? talentSum : 1
    };
  } catch (error) {
    return { isValid: false, level: 0 };
  }
}