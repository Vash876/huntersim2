export function usePresetData() {
  const PRESET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuA9mNH247uQbM1RrsPN8h0zbszvTVBR87Zt3FmQguuk5lQTvYLc3mA9f8W6ZsI_BYCuhhcG-bzi2c/pub?gid=497375591&single=true&output=csv';

  async function fetchPresetData() {
    try {
      console.log('Loading preset data from Google Sheets...');
      
      const response = await fetch(PRESET_CSV_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch preset CSV data');
      }
      
      const csvText = await response.text();
      
      return parsePresetCsv(csvText);
    } catch (error) {
      console.error('Error fetching preset data:', error);
      throw error;
    }
  }

  function parsePresetCsv(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    // Erste Zeile ignorieren (Header: milestones,category,spheres,floating,always,description)
    const dataLines = lines.slice(1);
    
    const presets = [];
    
    for (const line of dataLines) {
      const columns = parseCsvLine(line);
      
      // Mindestens 3 Spalten erforderlich (milestones, category, spheres)
      if (columns.length >= 3) {
        const [milestones, category, spheres, floating, always, description] = columns;
        
        // Parse spheres (immer in Anführungszeichen, komma-getrennt)
        const parsedSpheres = parseNumberArray(spheres);
        
        // Parse always (optional, komma-getrennt)
        const parsedAlways = always ? parseNumberArray(always) : [];
        
        // Parse floating (optional, kann Anführungszeichen haben)
        const parsedFloating = floating ? parseNumberArray(floating) : [];
        
        // Kombiniere always + spheres für die Gesamtauswahl
        const allSpheres = [...new Set([...parsedAlways, ...parsedSpheres])].sort((a, b) => a - b);
        
        presets.push({
          milestones: milestones.trim(),
          category: category.trim(),
          spheres: allSpheres,
          floating: parsedFloating,
          always: parsedAlways,
          description: description?.trim() || ''
        });
      }
    }
    
    return presets;
  }

  function parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    
    // Entferne führende/folgende Anführungszeichen
    return result.map(col => col.replace(/^"|"$/g, '').trim());
  }

  function parseNumberArray(str) {
    if (!str || str.trim() === '') return [];
    
    // Split bei Komma und parse zu Integer
    return str.split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
  }

  return {
    fetchPresetData
  };
}
