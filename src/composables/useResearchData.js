export function useResearchData() {
  // TODO: Ersetze mit deiner Google Sheets URL für Research Daten
  const RESEARCH_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuA9mNH247uQbM1RrsPN8h0zbszvTVBR87Zt3FmQguuk5lQTvYLc3mA9f8W6ZsI_BYCuhhcG-bzi2c/pub?gid=1551291973&single=true&output=csv';

  async function fetchResearchData() {
    try {
      console.log('Loading research data from Google Sheets...');
      
      const response = await fetch(RESEARCH_CSV_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch CSV data');
      }
      
      const csvText = await response.text();
      return parseResearchCsv(csvText);
    } catch (error) {
      console.error('Error fetching research data:', error);
      throw error;
    }
  }

  function parseResearchCsv(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    // Erste Zeile ignorieren (Header)
    const dataLines = lines.slice(1);
    
    const researches = [];
    
    for (const line of dataLines) {
      const columns = parseCsvLine(line);
      
      if (columns.length >= 6) {
        const [research, rank, rpCost, effect, type, requirement] = columns;
        
        const cost = parseFloat(rpCost);
        
        if (!isNaN(cost) && cost > 0) {
          const parsedRequirements = parseRequirements(requirement || '');
          
          researches.push({
            research: parseInt(research) || 0,
            rank: parseInt(rank) || 1,
            cost: cost,
            effect: effect?.trim() || '',
            type: type?.trim() || 'Standard',
            requiresInnovation: parsedRequirements.requiresInnovation
          });
        }
      }
    }
    
    return researches;
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
    return result.map(col => col.replace(/^"|"$/g, ''));
  }

  function parseRequirements(requirements) {
    const result = {
      requiresInnovation: 0
    };
    
    if (!requirements) return result;
    
    const req = requirements.toLowerCase();
    
    // Innovation Level Check (Inno2, Inno3)
    if (req.includes('inno3')) {
      result.requiresInnovation = 3;
    } else if (req.includes('inno2')) {
      result.requiresInnovation = 2;
    }
    
    return result;
  }

  return {
    fetchResearchData
  };
}