exports.handler = async (event) => {
  // Parameter extrahieren
  const params = event.queryStringParameters;
  const hunterId = params.hunter || 'borge';
  const buildCode = params.code || '';
  
  // Hardcodierte Hunter-Daten
  const hunters = {
    borge: { 
      name: 'Borge', 
      color: '#ef4444', 
      iconPath: 'M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M19,11c0,1.85-0.51,3.65-1.38,5.21l-1.45-1.45c0.59-1.33,0.88-2.77,0.88-4.21V6.3l-5.5-2.4v8.35l-2-2L8,11.79l4,4l4-4l-1.5-1.5l-2,2v-6.3l5.5,2.4V11z'
    },
    ozzy: { 
      name: 'Ozzy', 
      color: '#22c55e', 
      iconPath: 'M7,5H5v2h2V5z M19,5h-2v2h2V5z M12,15c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2s2,0.9,2,2C14,14.1,13.1,15,12,15z M13.8,17c-0.58,0.2-1.18,0.3-1.8,0.3c-0.62,0-1.22-0.1-1.8-0.3c-0.45,0.3-0.8,0.7-1,1.2C10.01,18.7,10.99,19,12,19c1.01,0,1.99-0.3,2.8-0.8C14.6,17.7,14.25,17.3,13.8,17z M23,3v18h-2V5H3v16H1V3H23z M17,7c0-2.76-2.24-5-5-5S7,4.24,7,7s2.24,5,5,5S17,9.76,17,7z M12,10c-1.65,0-3-1.35-3-3s1.35-3,3-3s3,1.35,3,3S13.65,10,12,10z M18,19c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S16.9,19,18,19z M6,19c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S4.9,19,6,19z'
    },
    knox: { 
      name: 'Knox', 
      color: '#3b82f6', 
      iconPath: 'M17 4l4 4l-4 4V9h-4V7h4V4z M10 7C9.45 7 9 7.45 9 8c0 0.55 0.45 1 1 1s1-0.45 1-1C11 7.45 10.55 7 10 7z M6 13c-0.55 0-1 0.45-1 1c0 0.55 0.45 1 1 1s1-0.45 1-1C7 13.45 6.55 13 6 13z M7 19l-4-4l4-4v3h4v2H7V19z M13 19.93V14h-2v3.93c0.97 0.02 1.69 0.06 2 0.07z M7 13h2V7H7V13z M14 7v4h2V8.4c0-0.53 0.05-1.04 0.14-1.4H14z'
    }
  };
  
  // Hunter-Daten abrufen
  const hunter = hunters[hunterId] || { 
    name: 'Hunter', 
    color: '#6b7280', 
    iconPath: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4z M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
  };
  
  // Build-Level aus dem Code extrahieren (vereinfacht)
  let level = 1;
  if (buildCode.length > 0) {
    // Einfache Heuristik: Länge des Codes / 2 (max 99)
    level = Math.min(99, Math.floor(buildCode.length / 2));
  }
  
  // SVG generieren
  const svg = `
    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
      <!-- Hintergrund -->
      <rect x="0" y="0" width="800" height="400" rx="15" fill="${hunter.color}" />
      <rect x="20" y="20" width="760" height="360" rx="10" fill="#1a1a1a" />
      
      <!-- Hunter Icon -->
      <g transform="translate(60, 120) scale(3)">
        <path d="${hunter.iconPath}" fill="${hunter.color}"/>
      </g>
      
      <!-- Text -->
      <text x="225" y="120" font-family="Arial" font-size="48" font-weight="bold" fill="white">
        ${hunter.name} Build
      </text>
      <text x="225" y="200" font-family="Arial" font-size="32" fill="${hunter.color}">
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
};