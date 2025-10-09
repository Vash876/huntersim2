/**
 * Composable für das Hunter Build Repository
 * Lädt und verarbeitet CSV-Daten aus Google Sheets für alle Hunter
 */

import { getHunterById } from '@/constants/hunters';

export function useBuildRepository() {
  
  async function fetchBuildData(hunterId) {
    try {
      console.log(`Loading build data for ${hunterId} from Google Sheets...`);
      
      const hunter = getHunterById(hunterId);
      if (!hunter?.buildRepositoryCsvUrl) {
        throw new Error(`No CSV URL found for hunter: ${hunterId}`);
      }
      
      const response = await fetch(hunter.buildRepositoryCsvUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV data for ${hunterId}`);
      }
      
      const csvText = await response.text();
      return parseBuildCsv(csvText, hunterId);
    } catch (error) {
      console.error(`Error fetching build data for ${hunterId}:`, error);
      throw error;
    }
  }

  function parseBuildCsv(csvText, hunterId) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    // Erste Zeile ignorieren (Header)
    const dataLines = lines.slice(1);
    
    const builds = [];
    
    for (const line of dataLines) {
      const columns = parseCsvLine(line);
      
      if (columns.length >= 3) {
        const [
          level,
          buildUrl,
          lootScore,
          stageRange,
          time,
          mat1PerRun,
          mat1PerDay,
          mat2PerRun,
          mat2PerDay,
          mat3PerRun,
          mat3PerDay,
          xpPerRun,
          xpPerDay,
          bossKillPercent,
          bossHpPercent,
          notes
        ] = columns;
        
        // Extract build code from URL
        const buildCode = extractBuildCode(buildUrl);
        if (!buildCode) continue; // Skip if no valid build code
        
        // Parse stage range (e.g., "10.2 (9-11)")
        const stageInfo = parseStageRange(stageRange);
        
        // Parse time (e.g., "8.4m (172)")
        const timeInfo = parseTimeInfo(time);
        
        // Parse numeric values
        const parsedLevel = parseInt(level);
        const parsedLootScore = parseFloat(lootScore);
        
        if (!isNaN(parsedLevel) && parsedLevel > 0 && buildCode) {
          builds.push({
            id: `${hunterId}_${parsedLevel}_${builds.length}`,
            hunterId,
            level: parsedLevel,
            buildCode,
            lootScore: isNaN(parsedLootScore) ? 0 : parsedLootScore,
            stage: stageInfo,
            time: timeInfo,
            materials: {
              mat1: {
                perRun: parseNumericValue(mat1PerRun),
                perDay: parseNumericValue(mat1PerDay)
              },
              mat2: {
                perRun: parseNumericValue(mat2PerRun),
                perDay: parseNumericValue(mat2PerDay)
              },
              mat3: {
                perRun: parseNumericValue(mat3PerRun),
                perDay: parseNumericValue(mat3PerDay)
              },
              xp: {
                perRun: parseNumericValue(xpPerRun),
                perDay: parseNumericValue(xpPerDay)
              }
            },
            bossKill: parsePercentage(bossKillPercent),
            bossHP: parsePercentage(bossHpPercent),
            notes: notes?.trim() || '',
            createdAt: new Date().toISOString()
          });
        }
      }
    }
    
    return builds;
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

  function extractBuildCode(buildUrl) {
    if (!buildUrl) return null;
    
    // Extract code from URLs like: https://cifi-tools.com/borge?code=MGEpRQ5c9d1TnDf2NZBWfJz7KoMtiwRYt2RCDBVV9
    const match = buildUrl.match(/code=([A-Za-z0-9]+)/);
    return match ? match[1] : null;
  }

  function parseStageRange(stageRange) {
    if (!stageRange) return { avg: 0, min: 0, max: 0 };
    
    // Parse "10.2 (9-11)" format
    const avgMatch = stageRange.match(/^(\d+\.?\d*)/);
    const rangeMatch = stageRange.match(/\((\d+)-(\d+)\)/);
    
    const avg = avgMatch ? parseFloat(avgMatch[1]) : 0;
    const min = rangeMatch ? parseInt(rangeMatch[1]) : avg;
    const max = rangeMatch ? parseInt(rangeMatch[2]) : avg;
    
    return { avg, min, max };
  }

  function parseTimeInfo(time) {
    if (!time) return { minutes: 0, runsPerDay: 0 };
    
    // Parse "8.4m (172)" or "1h 59m (12.1)" format
    let minutes = 0;
    let runsPerDay = 0;
    
    // Extract runs per day from parentheses
    const runsMatch = time.match(/\(([0-9.]+)\)/);
    if (runsMatch) {
      runsPerDay = parseFloat(runsMatch[1]);
    }
    
    // Extract time
    const hourMatch = time.match(/(\d+)h/);
    const minuteMatch = time.match(/(\d+\.?\d*)m/);
    
    if (hourMatch) {
      minutes += parseInt(hourMatch[1]) * 60;
    }
    if (minuteMatch) {
      minutes += parseFloat(minuteMatch[1]);
    }
    
    return { minutes, runsPerDay };
  }

  function parseNumericValue(value) {
    if (!value || value === '') return 0;
    
    // Handle values like "18.11k", "3.94k", etc.
    const numStr = value.toString().toLowerCase();
    
    if (numStr.includes('k')) {
      const num = parseFloat(numStr.replace('k', ''));
      return isNaN(num) ? 0 : num * 1000;
    }
    
    if (numStr.includes('m')) {
      const num = parseFloat(numStr.replace('m', ''));
      return isNaN(num) ? 0 : num * 1000000;
    }
    
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : num;
  }

  function parsePercentage(value) {
    if (!value || value === '') return 0;
    
    const numStr = value.toString().replace('%', '');
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : num;
  }

  return {
    fetchBuildData
  };
}