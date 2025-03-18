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
    
    // URL zur eigenen Bildgenerator-Funktion
    const imageUrl = `${url.origin}/.netlify/functions/generate-image?hunter=${hunterId}&level=${level}`;
    
    // Statische Hunter-Daten
    const hunters = {
      borge: { name: 'Borge' },
      ozzy: { name: 'Ozzy' },
      knox: { name: 'Knox' }
    };
    
    const hunter = hunters[hunterId] || { name: 'Hunter' };
    
    // HTML mit Meta-Tags zurückgeben
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hunter Simulator 2 - ${hunter.name} Build</title>
          <meta property="og:title" content="${hunter.name} Build - Level ${level}" />
          <meta property="og:description" content="Hunter Simulator - ${hunter.name} Build with Level ${level}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
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