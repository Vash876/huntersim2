// BuildCodeHandler-Klasse für die Build-Code-Funktionalität

import { BUILD_CODE_PARAMS as BORGE_PARAMS } from '../constants/borge';
import { BUILD_CODE_PARAMS as KNOX_PARAMS } from '../constants/knox';
import { BUILD_CODE_PARAMS as OZZY_PARAMS } from '../constants/ozzy';

// Base58-Alphabet für die Codierung (wie bei Bitcoin)
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

// Helfer-Funktionen für Base58-Kodierung
export function fillArray(d, h, x) {
  var N = -1,
      $ = d.length;
  h < 0 && (h = -h > $ ? 0 : $ + h),
  x = x > $ ? $ : x,
  x < 0 && (x += $),
  $ = h > x ? 0 : x - h >>> 0,
  h >>>= 0;
  for (var V = Array($); ++N < $;)
      V[N] = d[N + h];
  return V;
}

export function chunk(d, h) {
  var N = d.length;
  if (!N || h < 1)
      return [];
  for (var $ = 0, V = 0, re = Array(Math.ceil(N / h)); $ < N;)
      re[V++] = fillArray(d, $, $ += h);
  return re;
}

export function generateEncoder(e) {
  if (e.length >= 255)
      throw new TypeError("Alphabet too long");
  const t = new Uint8Array(256);
  for (let c = 0; c < t.length; c++)
      t[c] = 255;
  for (let c = 0; c < e.length; c++) {
      const u = e.charAt(c),
          f = u.charCodeAt(0);
      if (t[f] !== 255)
          throw new TypeError(u + " is ambiguous");
      t[f] = c;
  }
  const n = e.length,
      r = e.charAt(0),
      o = Math.log(n) / Math.log(256),
      a = Math.log(256) / Math.log(n);
  function encode(c) {
      if (c instanceof Uint8Array || (ArrayBuffer.isView(c) ? c = new Uint8Array(c.buffer, c.byteOffset, c.byteLength) : Array.isArray(c) && (c = Uint8Array.from(c))), !(c instanceof Uint8Array))
          throw new TypeError("Expected Uint8Array");
      if (c.length === 0)
          return "";
      let u = 0,
          f = 0,
          p = 0;
      const g = c.length;
      for (; p !== g && c[p] === 0;)
          p++,
          u++;
      const v = (g - p) * a + 1 >>> 0,
          b = new Uint8Array(v);
      for (; p !== g;) {
          let O = c[p],
              k = 0;
          for (let _ = v - 1; (O !== 0 || k < f) && _ !== -1; _--, k++)
              O += 256 * b[_] >>> 0,
              b[_] = O % n >>> 0,
              O = O / n >>> 0;
          if (O !== 0)
              throw new Error("Non-zero carry");
          f = k,
          p++;
      }
      let S = v - f;
      for (; S !== v && b[S] === 0;)
          S++;
      let w = r.repeat(u);
      for (; S < v; ++S)
          w += e.charAt(b[S]);
      return w;
  }
  function decodeUnsafe(c) {
      if (typeof c != "string")
          throw new TypeError("Expected String");
      if (c.length === 0)
          return new Uint8Array;
      let u = 0,
          f = 0,
          p = 0;
      for (; c[u] === r;)
          f++,
          u++;
      const g = (c.length - u) * o + 1 >>> 0,
          v = new Uint8Array(g);
      for (; c[u];) {
          let O = t[c.charCodeAt(u)];
          if (O === 255)
              return;
          let k = 0;
          for (let _ = g - 1; (O !== 0 || k < p) && _ !== -1; _--, k++)
              O += n * v[_] >>> 0,
              v[_] = O % 256 >>> 0,
              O = O / 256 >>> 0;
          if (O !== 0)
              throw new Error("Non-zero carry");
          p = k,
          u++;
      }
      let b = g - p;
      for (; b !== g && v[b] === 0;)
          b++;
      const S = new Uint8Array(f + (g - b));
      let w = f;
      for (; b !== g;)
          S[w++] = v[b++];
      return S;
  }
  function decode(c) {
      const u = decodeUnsafe(c);
      if (u)
          return u;
      throw new Error("Non-base" + n + " character");
  }
  return {
      encode,
      decodeUnsafe,
      decode
  };
}

// Globales Base58 Encoder-Objekt
const encoder = generateEncoder(BASE58_ALPHABET);

// Code-Handler-Klasse für Kompatibilität mit dem alten System
export class CodeHandler {
  constructor(kind, version, levels) {
    this.kind = kind;
    this.version = version;
    this.levels = levels;
  }
  
  toCode() {
    return encoder.encode(this.toBuffer());
  }
  
  toBuffer() {
    const buffer = [101, this.kind << 5 | this.version & 7];
    
    for (const chunk4 of chunk(this.levels, 4)) {
      const values = chunk4.map((level) => [level, level === 0 ? 0 : level === 1 ? 1 : level <= 255 ? 2 : 3]);
      
      // Fill array to 4 values
      while (values.length < 4) {
        values.push([0, 0]);
      }
      
      // Create the control byte
      buffer.push(values.reduce((acc, [_, type]) => acc << 2 | type, 0));
      
      // Add value bytes
      values.forEach(([value, type]) => {
        if (type === 2) {
          buffer.push(value & 255);
        } else if (type === 3) {
          buffer.push((value >> 8) & 255, value & 255);
        }
      });
    }
    
    return new Uint8Array(buffer);
  }
  
  static fromBuffer(buffer) {
    if (buffer.length < 2 || buffer[0] !== 101) {
      console.error('Invalid buffer format or header byte');
      return null;
    }
    
    const kind = buffer[1] >> 5;
    const version = buffer[1] & 7;
    const levels = [];
    let pos = 2;
    
    console.log('Kind:', kind, 'Version:', version);
    
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
    
    console.log('Decoded levels length:', levels.length);
    return new CodeHandler(kind, version, levels);
  }
  
  static fromCode(code) {
    try {
      return CodeHandler.fromBuffer(encoder.decode(code));
    } catch (e) {
      console.error('Error decoding code:', e);
      return null;
    }
  }
}

// Mapping-Tabellen für das Konvertieren von alten zu neuen Parameternamen
const PARAMETER_MAPPING = {
  // Borge
  'death': 'revival',         // Altes "Death Is My Companion" zu neuem "revival"
  'life': 'loth',             // Altes "Life of the Hunt" zu neuem "loth"
  'impacts': 'impeccable',    // Altes "Impeccable Impacts" zu neuem "impeccable"
  'fow': 'tfow',              // Altes "Fires of War" zu neuem "tfow"
  'helltouch': 'htb',         // Altes "Helltouch Barrier" zu neuem "htb"
  'inhaler': 'lfin',          // Altes "Lifedrain Inhaler" zu neuem "lfin"
  'punches': 'exp',           // Altes "Explosive Punches" zu neuem "exp"
  'weakspot': 'weak',         // Altes "Weakspot Analysis" zu neuem "weak"
  'bfb': 'battle',            // Altes "Born For Battle" zu neuem "battle"
  'critRate': 'critchance',   // Altes "Crit Rate" zu neuem "critchance"
  'critPower': 'critpower',   // Altes "Crit Power" zu neuem "critpower"
  'aspd': 'atkspeed',         // Altes "ATK Speed" zu neuem "atkspeed"
  // Füge weitere Mappings hinzu, wenn nötig
};

// Hauptexport-Klasse
export class BuildCodeHandler {
  /**
   * Generiert einen Code aus einem Build
   */
  static generateCode(build, storeData) {
    try {
      // Verfügbare Parameter-Arrays nach Hunter-Typ
      const paramArrays = {
        'borge': BORGE_PARAMS,
        'knox': KNOX_PARAMS,
        'ozzy': OZZY_PARAMS
      };

      const hunterId = build.hunterId || build.hunter;
      if (!hunterId || !paramArrays[hunterId]) {
        throw new Error(`Invalid hunter type: ${hunterId}`);
      }

      // Hunter-Typ als Nummer für den Code
      const hunterTypeCode = this.getHunterTypeCode(hunterId);
      
      // Parameter in der definierten Reihenfolge extrahieren
      const params = paramArrays[hunterId].map(paramKey => 
        this.extractParamValue(paramKey, build, storeData)
      );

      // Jetzt den Code erstellen mit alter Methode
      const codeHandler = new CodeHandler(hunterTypeCode, 0, params);
      return codeHandler.toCode();
    } catch (error) {
      console.error('Error generating build code:', error);
      return null;
    }
  }

  /**
   * Extrahiert den Wert eines Parameters aus dem Build und den Store-Daten
   */
  static extractParamValue(paramKey, build, storeData) {
    const hunterId = build.hunterId || build.hunter;
    
    // Override-Werte haben höchste Priorität
    if (build.overrides && paramKey in build.overrides) {
      return build.overrides[paramKey];
    }
    
    // Talent-Parameter suchen
    if (build.talents && paramKey in build.talents) {
      return build.talents[paramKey];
    }
    
    // Attribut-Parameter suchen
    if (build.attributes && paramKey in build.attributes) {
      return build.attributes[paramKey];
    }
    
    // Stats-Parameter je nach Hunter-Typ
    const hunterStatParams = {
      'borge': ['hp', 'atk', 'regen', 'dr', 'evade', 'effect', 'critchance', 'critpower', 'atkspeed', 'stage'],
      'ozzy': ['hp', 'atk', 'regen', 'dr', 'evade', 'effect', 'multichance', 'multipower', 'atkspeed', 'stage'],
      'knox': ['hp', 'atk', 'regen', 'dr', 'block', 'effect', 'charge', 'chargeGain', 'reload', 'proj', 'stage']
    };
    
    // Hunter-spezifische Stats prüfen
    const statParams = hunterStatParams[hunterId] || [];
    if (statParams.includes(paramKey)) {
      // Wenn in baseStats vorhanden
      if (build.baseStats && paramKey in build.baseStats) {
        return build.baseStats[paramKey];
      }
      // Oder wenn direkt im Build-Objekt
      if (paramKey in build) {
        return build[paramKey];
      }
      
      // Oder wenn im Store
      if (storeData && storeData.hunterStats && storeData.hunterStats[build.hunterId]) {
        return storeData.hunterStats[build.hunterId][paramKey] || 0;
      }
    }
  
    // "lvl" speziell behandeln
    if (paramKey === 'lvl') {
      return build.level || 0;
    }
    
    // Upgrade-Parameter suchen
    if (paramKey.startsWith('upgrades.')) {
      const parts = paramKey.split('.');
      
      if (parts.length === 3) {
        const [_, category, key] = parts;
        return storeData?.upgrades?.[category]?.[key] || 0;
      }
      
      if (parts.length === 4) {
        const [_, category, subcategory, key] = parts;
        return storeData?.upgrades?.[category]?.[subcategory]?.[key] || 0;
      }
    }
  
    // Wenn nichts gefunden wurde, 0 zurückgeben
    return 0;
  }

  /**
   * Konvertiert den Hunter-Namen in einen numerischen Typ-Code
   */
  static getHunterTypeCode(hunterId) {
    switch (hunterId.toLowerCase()) {
      case 'borge': return 1;
      case 'ozzy': return 3;
      case 'knox': return 6;
      default: throw new Error(`Invalid hunter type: ${hunterId}`);
    }
  }

  /**
   * Dekodiert einen Build-Code zurück in ein Build-Objekt
   */
  static parseCode(code) {
    try {
      console.log('Parsing build code:', code);
      
      // Dekodiere den Code mit alter Methode
      const data = CodeHandler.fromCode(code);
      
      if (!data) {
        console.error('Failed to decode build code');
        return null;
      }
      
      // Hunter-Typ aus dem Code bestimmen
      let hunterType;
      switch (data.kind) {
        case 1: hunterType = 'borge'; break;
        case 3: hunterType = 'ozzy'; break;
        case 6: hunterType = 'knox'; break;
        default: 
          console.error('Invalid hunter type code:', data.kind);
          return null;
      }
      
      // Parameter-Arrays nach Hunter-Typ laden
      const paramArrays = {
        'borge': BORGE_PARAMS,
        'knox': KNOX_PARAMS,
        'ozzy': OZZY_PARAMS
      };
      
      const paramArray = paramArrays[hunterType];
      if (!paramArray) {
        console.error('No parameter array found for hunter type:', hunterType);
        return null;
      }
      
      // Build-Objekt erstellen
      const build = {
        hunterId: hunterType,
        hunter: hunterType,
        name: `${hunterType.charAt(0).toUpperCase() + hunterType.slice(1)} Import`,
        level: 1,
        talents: {},
        attributes: {},
        overrides: {}
      };
      
      // Parameter aus den Levels extrahieren
      data.levels.forEach((value, index) => {
        if (index < paramArray.length && value > 0) {
          const paramKey = paramArray[index];
          this.setParamValue(build, paramKey, value, hunterType);
        }
      });
      
      console.log('Parsed build:', build);
      return build;
    } catch (error) {
      console.error('Error parsing build code:', error);
      return null;
    }
  }
  
  /**
   * Setzt einen Parameterwert im Build-Objekt
   */
  static setParamValue(build, paramKey, value, hunterType) {
    // Ignoriere Nullwerte
    if (value === 0 || value === null || value === undefined) return;
    
    // Definiere Stats-Parameter je nach Hunter-Typ
    const hunterStatParams = {
      'borge': ['hp', 'atk', 'regen', 'dr', 'evade', 'effect', 'critchance', 'critpower', 'atkspeed', 'stage'],
      'ozzy': ['hp', 'atk', 'regen', 'dr', 'evade', 'effect', 'multichance', 'multipower', 'atkspeed', 'stage'],
      'knox': ['hp', 'atk', 'regen', 'dr', 'block', 'effect', 'charge', 'chargeGain', 'reload', 'proj', 'stage']
    };
    
    // Definiere Talent-Parameter je nach Hunter-Typ
    const hunterTalentParams = {
      'borge': ['revival', 'loth', 'ua', 'impeccable', 'omen', 'll', 'pog', 'tfow', 'ultima'],
      'ozzy': ['revival', 'boon', 'ua', 'needles', 'omen', 'll', 'crip', 'echo', 'lotl', 'ultima'],
      'knox': ['revival', 'calyp', 'ua', 'ghost', 'omen', 'll', 'pog', 'finish', 'ultima']
    };
    
    // Definiere Attribut-Parameter je nach Hunter-Typ
    const hunterAttributeParams = {
      'borge': ['ares', 'ylith', 'spartan', 'timeless', 'baal', 'sensors', 'htb', 'lfin', 'exp', 
                'atlas', 'weak', 'battle', 'mino', 'hermes', 'athena'],
      'ozzy': ['exo', 'scorp', 'timeless', 'ibu', 'exterm', 'snek', 'vect', 'cycle', 'deal', 
               'medusa', 'dance', 'sisters', 'scarab', 'cat'],
      'knox': ['kraken', 'spa', 'pl', 'time', 'soul', 'dead', 'fe', 'sop', 'sear', 'pct', 'kot']
    };
    
    // Stats - prüfe hunter-spezifisch
    const statParams = hunterStatParams[hunterType] || [];
    if (statParams.includes(paramKey)) {
      build.overrides[paramKey] = value;
      return;
    }
    
    // Talente - prüfe hunter-spezifisch
    const talentParams = hunterTalentParams[hunterType] || [];
    if (talentParams.includes(paramKey)) {
      build.talents[paramKey] = value;
      return;
    }
    
    // Attribute - prüfe hunter-spezifisch
    const attributeParams = hunterAttributeParams[hunterType] || [];
    if (attributeParams.includes(paramKey)) {
      build.attributes[paramKey] = value;
      return;
    }
    
    // Upgrade-Parameter
    if (paramKey.startsWith('upgrades.')) {
      build.overrides[paramKey] = value;
      return;
    }
    
    // Fallback - falls nichts passt, als Override setzen
    console.log(`Parameter ${paramKey} konnte keiner Kategorie zugeordnet werden, setze als Override`);
    build.overrides[paramKey] = value;
  }
}