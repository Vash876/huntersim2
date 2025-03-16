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
    
    // Statische Hunter-Daten direkt im Script
    const hunters = {
      borge: { name: 'Borge', color: '#ef4444', level: getBuildLevel(buildCode) },
      ozzy: { name: 'Ozzy', color: '#22c55e', level: getBuildLevel(buildCode) },
      knox: { name: 'Knox', color: '#3b82f6', level: getBuildLevel(buildCode) }
    };
    
    // Hunter-Daten abrufen oder Fallback
    const hunter = hunters[hunterId] || { name: 'Hunter', color: '#6b7280', level: getBuildLevel(buildCode) };
    
    // Statt Shields.io nutzen wir einen statischen Link zu einem einfachen Bild
    // Dies ist ein Beispiel - idealer wäre eine eigene Netlify Function, die ein Bild generiert
    const imageUrl = `https://via.placeholder.com/1200x630/${hunter.color.substring(1)}/FFFFFF?text=Hunter+${hunter.name}+-+Level+${hunter.level}`;
    
    // HTML mit Meta-Tags zurückgeben
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hunter Simulator 2 - ${hunter.name} Build</title>
          <meta property="og:title" content="Hunter Simulator 2 - ${hunter.name} Build" />
          <meta property="og:description" content="Level ${hunter.level} ${hunter.name} Build - Click to view stats and details" />
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