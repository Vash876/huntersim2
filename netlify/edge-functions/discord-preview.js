import { CodeHandler, encoder, generateEncoder } from '../../src/utils/BuildCodeHandler';

// Base58-Alphabet für die Codierung (importiert aus BuildCodeHandler, hier zur Sicherheit)
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

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
    
    // Level aus Code berechnen mit der verbesserten Funktion
    const level = getBuildLevel(buildCode, hunterId);
    
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
          <title>Hunter Simulator 2 - ${hunter.name} Build (Level ${level})</title>
          <meta property="og:title" content="${hunter.name} Build - Level ${level}" />
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

/**
 * Verbesserte Funktion zum Ermitteln des Build-Levels basierend auf Talents und Attributen
 */
function getBuildLevel(code, hunterType) {
  try {
    // Versuchen, den Code zu decodieren
    const localEncoder = generateEncoder(BASE58_ALPHABET);
    const data = CodeHandler.fromCode(code);
    
    if (!data) return 1; // Fallback bei Decodierungsfehler
    
    // Parameter-Indizes für Talente und Attribute nach Hunter-Typ
    const talentIndices = {
      'borge': {
        talents: [10, 11, 12, 13, 14, 15, 16, 17, 18], // Indizes der Talente im borge.js BUILD_CODE_PARAMS Array
        attributes: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33] // Indizes der Attribute
      },
      'ozzy': {
        talents: [10, 11, 12, 13, 14, 15, 16, 17, 18],
        attributes: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33]
      },
      'knox': {
        talents: [11, 12, 13, 14, 15, 16, 17, 18, 19],
        attributes: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
      }
    };
    
    // Standardmäßig borge verwenden, wenn der Hunter-Typ ungültig ist
    const indices = talentIndices[hunterType] || talentIndices.borge;
    
    // Talent-Punkte summieren
    let talentPoints = 0;
    indices.talents.forEach(index => {
      if (index < data.levels.length) {
        talentPoints += data.levels[index] || 0;
      }
    });
    
    // Attribut-Punkte summieren
    let attributePoints = 0;
    indices.attributes.forEach(index => {
      if (index < data.levels.length) {
        attributePoints += data.levels[index] || 0;
      }
    });
    
    // Build-Level basierend auf Talent-Punkten berechnen (vereinfachte Annäherung)
    // Jeder Talent-Punkt repräsentiert ungefähr 10-15 Level, Attribute geben zusätzlich Level
    const estimatedLevel = 1 + Math.floor(talentPoints * 1.2) + Math.floor(attributePoints * 0.5);
    
    // Zwischen 1 und 99 begrenzen
    return Math.max(1, Math.min(99, estimatedLevel));
  } catch (error) {
    console.error('Error calculating build level:', error);
    return 1; // Fallback bei Fehler
  }
}