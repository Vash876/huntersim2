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
    
    // Level aus Code schätzen
    const level = getBuildLevel(buildCode);
    
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
          <meta property="og:description" content="Check out this ${hunter.name} build on Hunter Simulator. " />
          <meta property="og:url" content="${url.href}" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Hunter Simulator" />
          <meta property="theme-color" content="${hunter.color}" />
          
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