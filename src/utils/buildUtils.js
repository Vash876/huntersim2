// Base58-Alphabet für die Codierung
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

// Base58-Dekodierung
export function decodeBase58(str) {
  const base = BASE58_ALPHABET.length;
  const lookup = {};
  for (let i = 0; i < BASE58_ALPHABET.length; i++) {
    lookup[BASE58_ALPHABET[i]] = i;
  }

  let bytes = [0];
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (lookup[c] === undefined) {
      throw new Error(`Invalid character: ${c}`);
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

// Build-Code dekodieren
export function fromCode(code) {
  try {
    const buffer = decodeBase58(code);
    if (!buffer || buffer.length < 2) return null;
    
    // Header-Bytes lesen
    const magicByte = buffer[0];
    const kindVersionByte = buffer[1];
    
    // Wenn magicByte nicht 101 ist, handelt es sich möglicherweise nicht um einem gültigen Build-Code
    if (magicByte !== 101) {
      console.warn(`Unexpected magic byte: ${magicByte}`);
    }
    
    const kind = kindVersionByte >> 5;
    const version = kindVersionByte & 7;
    
    const levels = [];
    let pos = 2;
    
    // Daten aus dem Buffer lesen
    while (pos < buffer.length) {
      const controlByte = buffer[pos++];
      
      // Extrahiert 4 Werte (je 2 Bits) aus dem Control-Byte
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
    
    return { kind, version, levels };
  } catch (error) {
    console.error("Error decoding build code:", error);
    return null;
  }
}

// Parameter-Positionen für die Level-Berechnung
export const TALENT_INDICES = {
  'borge': [0, 1, 2, 3, 4, 5, 6, 7, 53],
  'ozzy':  [0, 1, 2, 3, 4, 5, 6, 7, 41],
  'knox':  [0, 1, 2, 3, 4, 5, 6, 7, 8]
};

// Build-Level berechnen
export function calculateBuildLevel(code, hunterId) {
  try {
    // Versuchen, den Code zu decodieren
    const data = fromCode(code);
    
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
    return { 
      isValid: true, 
      level: talentSum > 0 ? talentSum : 1
    };
  } catch (error) {
    console.error("Error calculating level:", error);
    return { isValid: false, level: 0 };
  }
}