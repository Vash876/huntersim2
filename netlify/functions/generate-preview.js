const { getHunterById } = require('../../src/constants/hunters');
const { getIconPath } = require('../../src/utils/iconPaths');

exports.handler = async (event) => {
  // Parameter extrahieren
  const params = new URLSearchParams(event.queryStringParameters);
  const hunterId = params.get('hunter') || 'borge';
  const buildCode = params.get('code') || '';
  
  try {
    // Hunter-Daten abrufen
    const hunter = getHunterById(hunterId);
    
    // Build-Level aus dem Code extrahieren (vereinfacht)
    let level = 1;
    if (buildCode.length > 0) {
      // Einfache Heuristik: Länge des Codes / 2 (max 99)
      level = Math.min(99, Math.floor(buildCode.length / 2));
    }
    
    // SVG-Pfad aus der Hilfsfunktion abrufen
    const iconPath = getIconPath(hunter.icon.name);
    
    // Farbe aus dem Hunter-Objekt
    const colorMap = {
      'red': '#ef4444',
      'green': '#22c55e',
      'blue': '#3b82f6'
    };
    const color = colorMap[hunter.color] || '#6b7280';
    
    // SVG generieren
    const svg = `
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <!-- Hintergrund -->
        <rect x="0" y="0" width="800" height="400" rx="15" fill="${color}" />
        <rect x="20" y="20" width="760" height="360" rx="10" fill="#1a1a1a" />
        
        <!-- Hunter Icon -->
        <g transform="translate(60, 120) scale(3)">
          <path d="${iconPath}" fill="${color}"/>
        </g>
        
        <!-- Text -->
        <text x="225" y="120" font-family="Arial" font-size="48" font-weight="bold" fill="white">
          ${hunter.name} Build
        </text>
        <text x="225" y="200" font-family="Arial" font-size="32" fill="${color}">
          Level ${level}
        </text>
        <text x="225" y="300" font-family="Arial" font-size="24" fill="#aaaaaa">
          Click to view build details in Hunter Simulator 2
        </text>
      </svg>
    `;
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=604800"
      },
      body: svg
    };
  } catch (error) {
    console.error('Error generating SVG:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate preview' })
    };
  }
};