export default async function handler(request, context) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Discord Bot erkennen
  const isDiscordBot = userAgent.includes('Discordbot');
  
  // Prüfen, ob es ein Build-Link ist
  if ((isDiscordBot || url.searchParams.has('preview')) && 
      url.pathname.match(/\/[a-zA-Z0-9]+/) && 
      url.searchParams.has('code')) {
    
    // Hunter-ID aus der URL extrahieren
    const hunterId = url.pathname.substring(1);
    const buildCode = url.searchParams.get('code');
    
    // Statische Hunter-Daten direkt im Script, statt Import
    const hunters = {
      borge: { name: 'Borge', color: 'red', level: getBuildLevel(buildCode) },
      ozzy: { name: 'Ozzy', color: 'green', level: getBuildLevel(buildCode) },
      knox: { name: 'Knox', color: 'blue', level: getBuildLevel(buildCode) }
    };
    
    // Hunter-Daten abrufen oder Fallback
    const hunter = hunters[hunterId] || { name: 'Hunter', color: 'gray', level: getBuildLevel(buildCode) };
    
    // Shields.io URL für das Bild erstellen
    const imageUrl = `https://img.shields.io/badge/Hunter_${hunter.name}-Level_${hunter.level}-${hunter.color}?style=for-the-badge&logo=data:image/svg+xml;base64,${getHunterIconBase64(hunterId)}&logoWidth=40&logoColor=white`;
    
    // HTML mit Meta-Tags zurückgeben
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hunter Simulator 2 - ${hunter.name} Build</title>
          <meta property="og:title" content="Hunter Simulator 2 - ${hunter.name} Build (Level ${hunter.level})" />
          <meta property="og:description" content="Click to view detailed stats and skills for this ${hunter.name} build" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${url.href}" />
          <meta property="og:type" content="website" />
          <meta property="twitter:card" content="summary_large_image" />
          
          <!-- Weiterleitung für normale Browser -->
          <meta http-equiv="refresh" content="0;url=${url.href}">
        </head>
        <body>
          <p>Redirecting to Hunter Simulator 2...</p>
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

// Einfache Funktion zum Schätzen des Build-Levels basierend auf Code-Länge
function getBuildLevel(code) {
  return code ? Math.min(99, Math.floor(code.length / 2)) : 1;
}

// Base64-kodierte Icons für jeden Hunter
function getHunterIconBase64(hunterId) {
  const icons = {
    // Borge - Tool Icon
    borge: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTQuNyA2LjNhMSAxIDAgMCAwIDAgMS40bDEuNiAxLjZhMSAxIDAgMCAwIDEuNCAwbDMuNzc4LTMuNzc3YTYgNiAwIDAgMSAtNy44NTYgOS4wMkw4IDIwYTIgMiAwIDAgMS0yLjgyOCAwTDQgMTguODI4YTIgMiAwIDAgMSAwLTIuODI4bDUuNDU3LTUuNDU3YTYgNiAwIDAgMSA5LjAyLTcuODU1TDE0LjcgNi4zeiI+PC9wYXRoPjxwYXRoIGQ9Ik03IDEydDUgNSI+PC9wYXRoPjwvc3ZnPg==',
    
    // Ozzy - Plant Icon
    ozzy: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMTBhNiA2IDAgMCAwLTYtNkg0djJhNiA2IDAgMCAwIDYgNkg5YTggOCAwIDAgMSA4IDhoMWEyIDIgMCAwIDAgMi0ydi0xYTcgNyAwIDAgMC03LTd6Ij48L3BhdGg+PHBhdGggZD0iTTIgMmg0djJINnoiPjwvcGF0aD48cGF0aCBkPSJNMiAxOGgxMHYySDJ6Ij48L3BhdGg+PHBhdGggZD0iTTIgMTR2LTNoMlYzaDJ2NDEwaDJWO3BhdGg+PC9zdmc+',
    
    // Knox - Anchor Icon
    knox: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjUiIHI9IjMiPjwvY2lyY2xlPjxsaW5lIHgxPSIxMiIgeTE9IjIyIiB4Mj0iMTIiIHkyPSI4Ij48L2xpbmU+PHBhdGggZD0iTTUpPC9wYXRoPjxsaW5lIHgxPSIxOCIgeTE9IjEzIiB4Mj0iMTIiIHkyPSIxNyI+PC9saW5lPjwvc3ZnPg=='
  };
  
  return icons[hunterId] || 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjFWMmwLTIybDIgMTlMNyAyeiIgLz48cGF0aCBkPSJNMTIgMTJjMi4yIDAgNC0xLjggNC00cy0xLjgtNC00LTQtNCAxLjgtNCA0IDEuOCA0IDQgNHoiPjwvcGF0aD48cGF0aCBkPSJNMTIgMTJjLTIuNyAwLTggMS4zLTggNHYyaDE2di0yYzAtMi43LTUuMy00LTgtNHoiPjwvcGF0aD48L3N2Zz4=';
}