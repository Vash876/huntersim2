export function useLoopModData() {
  const LOOP_MOD_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuA9mNH247uQbM1RrsPN8h0zbszvTVBR87Zt3FmQguuk5lQTvYLc3mA9f8W6ZsI_BYCuhhcG-bzi2c/pub?gid=868365929&single=true&output=csv';
  const TIER_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuA9mNH247uQbM1RrsPN8h0zbszvTVBR87Zt3FmQguuk5lQTvYLc3mA9f8W6ZsI_BYCuhhcG-bzi2c/pub?gid=754030021&single=true&output=csv';

  async function fetchLoopModData() {
    try {
      console.log('Loading loop mod data from Google Sheets...');
      
      const [loopModResponse, tierResponse] = await Promise.all([
        fetch(LOOP_MOD_CSV_URL),
        fetch(TIER_CSV_URL)
      ]);
      
      if (!loopModResponse.ok || !tierResponse.ok) {
        throw new Error('Failed to fetch CSV data');
      }
      
      const loopModCsv = await loopModResponse.text();
      const tierCsv = await tierResponse.text();
      
      return {
        loopMods: parseLoopModCsv(loopModCsv),
        tiers: parseTierCsv(tierCsv)
      };
    } catch (error) {
      console.error('Error fetching loop mod data:', error);
      throw error;
    }
  }

  function parseLoopModCsv(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    // Erste Zeile ignorieren (Header)
    const dataLines = lines.slice(1);
    
    const loopMods = [];
    
    for (const line of dataLines) {
      const columns = parseCsvLine(line);
      
      if (columns.length >= 3) {
        const [name, rank, mpCost, buffs, requirements, notes] = columns;
        
        const cost = parseFloat(mpCost);
        
        if (!isNaN(cost) && cost > 0) {
          const parsedRequirements = parseRequirements(requirements || '');
          
          loopMods.push({
            name: name.trim(),
            level: parseInt(rank) || 1,
            cost: cost,
            buffs: buffs ? buffs.split(',').map(b => b.trim()) : [],
            requiresTemp3: parsedRequirements.requiresTemp3,
            requiresI61Level: parsedRequirements.requiresI61Level,
            requiresI75Level: parsedRequirements.requiresI75Level,
            requiresUltimaCap: parsedRequirements.requiresUltimaCap,
            notes: notes?.trim() || ''
          });
        }
      }
    }
    
    return loopMods;
  }

  function parseTierCsv(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return {};
    
    // Erste Zeile ignorieren (Header)
    const dataLines = lines.slice(1);
    
    const tiers = {};
    
    for (const line of dataLines) {
      const columns = parseCsvLine(line);
      
      if (columns.length >= 2) {
        const [loopModName, tier] = columns;
        tiers[loopModName.trim()] = tier.trim();
      }
    }
    
    return tiers;
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
      requiresTemp3: false,
      requiresI61Level: 0, // NEU: i61 Level
      requiresI75Level: 0,
      requiresUltimaCap: 0
    };
    
    if (!requirements) return result;
    
    const req = requirements.toLowerCase();
    
    // Temp3 Check bleibt gleich
    if (req.includes('temp3')) {
      result.requiresTemp3 = true;
    }
    
    // i61-Level Check (i61-1, i61-2, ... i61-5)
    const i61Match = req.match(/i61-(\d+)/);
    if (i61Match) {
      result.requiresI61Level = parseInt(i61Match[1]) || 0;
    }
    
    // i75-Level Check (i75-1, i75-2, ... i75-10)
    const i75Match = req.match(/i75-(\d+)/);
    if (i75Match) {
      result.requiresI75Level = parseInt(i75Match[1]) || 0;
    }
    
    // Ultima Cap Check bleibt gleich
    const ultimaCapMatch = req.match(/ultima cap \+(\d+)/);
    if (ultimaCapMatch) {
      result.requiresUltimaCap = parseInt(ultimaCapMatch[1]) || 0;
    }
    
    return result;
  }

  return {
    fetchLoopModData
  };
}