const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

exports.handler = async (event) => {
  try {
    // Parameter aus der URL extrahieren
    const params = event.queryStringParameters;
    const hunterId = params.hunter || 'borge';
    const level = parseInt(params.level || '1', 10);
    
    // Hunter-Daten konfigurieren
    const hunters = {
      borge: { name: 'Borge', color: '#ef4444', darkColor: '#b91c1c' },
      ozzy: { name: 'Ozzy', color: '#22c55e', darkColor: '#166534' },
      knox: { name: 'Knox', color: '#3b82f6', darkColor: '#1d4ed8' }
    };
    
    const hunter = hunters[hunterId] || { name: 'Hunter', color: '#6b7280', darkColor: '#374151' };
    
    // Canvas für das Bild erstellen
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');
    
    // Hintergrund zeichnen
    ctx.fillStyle = hunter.darkColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Innerer Hintergrund
    ctx.fillStyle = '#1f2937'; // Dark gray
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Header-Balken
    ctx.fillStyle = hunter.color;
    ctx.fillRect(40, 40, canvas.width - 80, 100);
    
    // Text konfigurieren
    ctx.textAlign = 'center';
    
    // Titel zeichnen
    ctx.font = 'bold 60px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Hunter Simulator 2', canvas.width / 2, 115);
    
    // Hunter-Name zeichnen
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${hunter.name} Build`, canvas.width / 2, 250);
    
    // Level-Anzeige
    ctx.fillStyle = hunter.color;
    ctx.fillRect(canvas.width/2 - 150, 280, 300, 80);
    
    ctx.font = 'bold 50px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Level ${level}`, canvas.width / 2, 340);
    
    // Info-Text am Ende
    ctx.font = '30px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Click to view build details', canvas.width / 2, 550);
    
    // Das Bild als Buffer zurückgeben
    const buffer = canvas.toBuffer('image/png');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=604800'
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate image' })
    };
  }
};