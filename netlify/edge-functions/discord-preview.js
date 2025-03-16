import { getHunterById } from '../../src/constants/hunters';

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
    
    try {
      // Hunter-Daten über die bestehende Funktion abrufen
      const hunter = getHunterById(hunterId);
      
      // HTML mit Meta-Tags zurückgeben
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Hunter Simulator 2 - ${hunter.name} Build</title>
            <meta property="og:title" content="Hunter Simulator 2 - ${hunter.name} Build" />
            <meta property="og:description" content="Check out this ${hunter.name} build! Click to view details." />
            <meta property="og:image" content="${url.origin}/.netlify/functions/generate-preview?hunter=${hunterId}&code=${encodeURIComponent(buildCode)}" />
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
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  }
  
  // Für alle anderen Anfragen: normale Seite anzeigen
  return context.next();
}