/**
 * CIFI TR Tracker - Apps Script API - PRODUCTION VERSION
 * Mit dynamischer Custom Resource Unterstützung
 */

// Configuration
const CONFIG = {
  TRAVERSAL_PREFIX: 'Traversal Reset #',
  DATA_START_ROW: 2,
  DESCRIPTION_COLUMN: 'A'
};

// Standard Column Mapping
const COLUMN_MAP = {
  'time in tr': 'E',
  'oo (accum)': 'G',
  'lr ticks': 'H',
  'lr count': 'I',
  'loops filled': 'J',
  'loop mods purchased': 'K',
  'attgn3 buff': 'L',
  'player level': 'M',
  'cells': 'N',
  'mp': 'Q',
  'mp (accum)': 'R',
  'shards': 'U',
  'rp': 'X',
  'ap': 'AA',
  'f1-1 difar': 'AB',
  'blueprints': 'AC',
  'inno cores': 'AD',
  'daily farm frags': 'AE',
  'current camp': 'AF',
  'camp timer': 'AG',
  'notes': 'AI'
};

/**
 * MAIN HANDLER - doGet function
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'unknown';
    const callback = e.parameter.callback;
    
    let result;
    
    switch(action) {
      case 'validateConnection':
        result = validateConnection();
        break;
        
      case 'getTraversalSheets':
        result = getTraversalSheets();
        break;
        
      case 'createTraversalSheet':
        result = handleCreateTraversalSheet(e.parameter);
        break;
        
      case 'addDailyEntry':
        result = handleAddDailyEntry(e.parameter);
        break;
        
      case 'getSheetData':
        result = getSheetData(e.parameter.sheetName);
        break;
        
      case 'getResourceColumns':
        result = getResourceColumns(e.parameter.sheetName);
        break;
        
      case 'updateCell':
        result = handleUpdateCell(e.parameter);
        break;
        
      default:
        result = { error: 'Unknown action: ' + action };
    }
    
    const responseData = {
      success: !result.error,
      data: result.error ? null : result,
      error: result.error || null,
      timestamp: new Date().toISOString()
    };
    
    // JSONP response if callback provided
    if (callback) {
      const jsonpResponse = callback + '(' + JSON.stringify(responseData) + ');';
      return ContentService
        .createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    const errorResponse = {
      success: false,
      data: null,
      error: error.toString(),
      timestamp: new Date().toISOString()
    };
    
    const callback = e.parameter.callback;
    if (callback) {
      const jsonpResponse = callback + '(' + JSON.stringify(errorResponse) + ');';
      return ContentService
        .createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * KORRIGIERTE getColumn Function mit dynamischer Custom Resource Detection
 */
function getColumn(key) {
  if (key === null || key === undefined || typeof key !== 'string') {
    return null;
  }
  
  const trimmedKey = key.trim();
  if (trimmedKey === '') {
    return null;
  }
  
  const normalizedKey = trimmedKey.toLowerCase();
  
  console.log(`=== getColumn DEBUG ===`);
  console.log(`Input key: "${key}"`);
  console.log(`Normalized key: "${normalizedKey}"`);
  
  // Standard mapping
  let column = COLUMN_MAP[normalizedKey];
  console.log(`Standard mapping result: ${column}`);
  
  // Falls nicht gefunden, prüfe auf Custom Resources
  if (!column) {
    console.log(`No standard mapping found, checking for custom resource...`);
    
    // DYNAMISCH: Lade Custom Resources aus dem aktuellen Sheet-Header
    const customResourceColumns = getCustomResourcesFromCurrentSheet();
    console.log(`Found custom resource columns:`, customResourceColumns);
    
    column = customResourceColumns[normalizedKey];
    
    if (column) {
      console.log(`✅ Custom resource "${normalizedKey}" found in column ${column}`);
    } else {
      // FALLBACK: Auto-assign nächste verfügbare Custom Resource Spalte
      console.log(`❌ Custom resource "${normalizedKey}" not found, auto-assigning...`);
      
      // Finde die nächste freie Custom Resource Spalte (ab AJ = Index 36)
      const nextAvailableColumn = findNextAvailableCustomResourceColumn();
      
      if (nextAvailableColumn) {
        column = nextAvailableColumn;
        console.log(`🚀 Auto-assigned "${normalizedKey}" to column ${column}`);
        
        // Optional: Setze Header im Sheet
        try {
          const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
          const properties = PropertiesService.getScriptProperties();
          const activeSheetName = properties.getProperty('ACTIVE_SHEET_NAME');
          
          if (activeSheetName) {
            const sheet = spreadsheet.getSheetByName(activeSheetName);
            if (sheet) {
              const columnIndex = columnLetterToIndex(column);
              sheet.getRange(1, columnIndex).setValue(key); // Ursprünglicher Key als Header
              console.log(`📝 Set header "${key}" in column ${column}`);
            }
          }
        } catch (headerError) {
          console.log('Could not set header:', headerError);
        }
      }
    }
  }
  
  console.log(`Final column result: ${column}`);
  return column;
}

/**
 * NEUE HELPER FUNCTION: Finde nächste verfügbare Custom Resource Spalte
 */
function findNextAvailableCustomResourceColumn() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const properties = PropertiesService.getScriptProperties();
    const activeSheetName = properties.getProperty('ACTIVE_SHEET_NAME');
    
    if (!activeSheetName) {
      return 'AJ'; // Default erste Custom Resource Spalte
    }
    
    const sheet = spreadsheet.getSheetByName(activeSheetName);
    if (!sheet) {
      return 'AJ';
    }
    
    // Prüfe Spalten ab AJ (Index 36) bis AZ (Index 52)
    for (let i = 36; i <= 52; i++) {
      const columnLetter = columnIndexToLetter(i);
      const headerValue = sheet.getRange(1, i).getValue();
      
      // Wenn Header leer ist, ist diese Spalte verfügbar
      if (!headerValue || headerValue.toString().trim() === '') {
        console.log(`Found available column: ${columnLetter}`);
        return columnLetter;
      }
    }
    
    // Fallback: AJ wenn alles belegt
    return 'AJ';
  } catch (error) {
    console.error('Error finding available column:', error);
    return 'AJ';
  }
}

/**
 * HELPER: Column Letter zu Index (A=1, B=2, AA=27, etc.)
 */
function columnLetterToIndex(column) {
  if (!column || typeof column !== 'string') return 0;
  
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 64);
  }
  return result;
}

/**
 * NEUE FUNCTION: Dynamisch Custom Resources aus aktuellem Sheet-Header lesen
 */
function getCustomResourcesFromCurrentSheet() {
  try {
    // Versuche den aktiven Sheet-Namen aus Properties zu holen
    const properties = PropertiesService.getScriptProperties();
    const activeSheetName = properties.getProperty('ACTIVE_SHEET_NAME');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = null;
    
    if (activeSheetName) {
      try {
        sheet = spreadsheet.getSheetByName(activeSheetName);
        console.log(`Using active sheet: ${activeSheetName}`);
      } catch (e) {
        console.log(`Active sheet not found: ${activeSheetName}`);
      }
    }
    
    // Fallback: Verwende das erste Traversal Sheet
    if (!sheet) {
      const sheets = spreadsheet.getSheets();
      sheet = sheets.find(s => s.getName().startsWith(CONFIG.TRAVERSAL_PREFIX)) || sheets[0];
      
      if (sheet) {
        console.log(`Fallback to sheet: ${sheet.getName()}`);
      }
    }
    
    if (!sheet) {
      console.log('No sheet found for custom resource detection');
      return {};
    }
    
    console.log(`Analyzing sheet: ${sheet.getName()}`);
    
    // Lese Header-Zeile (Zeile 1)
    const lastCol = Math.min(sheet.getLastColumn(), 50); // Limit für Performance
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    const customResourceMap = {};
    
    // Custom Resources starten ab Spalte AJ (Index 35)
    for (let i = 35; i < headers.length && i < 50; i++) {
      const headerValue = headers[i];
      if (headerValue && headerValue.toString().trim()) {
        const resourceName = headerValue.toString().toLowerCase().trim();
        const columnLetter = columnIndexToLetter(i + 1); // +1 weil Header 1-basiert
        
        customResourceMap[resourceName] = columnLetter;
        console.log(`Found custom resource: "${resourceName}" -> ${columnLetter}`);
      }
    }
    
    return customResourceMap;
  } catch (error) {
    console.error('Error getting custom resources from sheet:', error);
    return {};
  }
}

/**
 * Set active sheet name for context
 */
function setActiveSheetName(sheetName) {
  try {
    const properties = PropertiesService.getScriptProperties();
    properties.setProperty('ACTIVE_SHEET_NAME', sheetName);
    console.log(`Set active sheet name: ${sheetName}`);
  } catch (error) {
    console.log('Could not set active sheet name:', error);
  }
}

/**
 * HELPER: Column Index zu Letter Converter
 */
function columnIndexToLetter(index) {
  let result = '';
  while (index > 0) {
    index--;
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26);
  }
  return result;
}

/**
 * VALIDATION Functions
 */
function validateConnection() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    
    return {
      connected: true,
      spreadsheetName: spreadsheet.getName(),
      sheetCount: sheets.length,
      traversalSheets: sheets.filter(s => s.getName().startsWith(CONFIG.TRAVERSAL_PREFIX)).length
    };
  } catch (error) {
    return { error: 'Connection validation failed: ' + error.toString() };
  }
}

/**
 * SHEET Management Functions
 */
function getTraversalSheets() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    
    const traversalSheets = sheets
      .filter(sheet => sheet.getName().startsWith(CONFIG.TRAVERSAL_PREFIX))
      .map(sheet => {
        try {
          return {
            name: sheet.getName(),
            resetNumber: parseInt(sheet.getName().replace(CONFIG.TRAVERSAL_PREFIX, '')),
            lastModified: new Date().toISOString(),
            rowCount: sheet.getLastRow(),
            columnCount: sheet.getLastColumn()
          };
        } catch (sheetError) {
          return {
            name: sheet.getName(),
            resetNumber: parseInt(sheet.getName().replace(CONFIG.TRAVERSAL_PREFIX, '')),
            lastModified: new Date().toISOString(),
            rowCount: 1,
            columnCount: 1
          };
        }
      })
      .filter(sheet => !isNaN(sheet.resetNumber))
      .sort((a, b) => a.resetNumber - b.resetNumber);
      
    return {
      sheets: traversalSheets,
      totalResets: traversalSheets.length
    };
  } catch (error) {
    return { error: 'Failed to get sheets: ' + error.toString() };
  }
}

function handleCreateTraversalSheet(params) {
  try {
    const resetNumber = parseInt(params.resetNumber);
    if (!resetNumber || resetNumber < 1) {
      return { error: 'Invalid reset number' };
    }
    
    const planData = {
      resetNumber: resetNumber,
      startDate: params.startDate || new Date().toISOString(),
      planName: params.planName || 'Unnamed Plan',
      goals: params.goals ? JSON.parse(params.goals) : {},
      startingValues: params.startingValues ? JSON.parse(params.startingValues) : {},
      customResources: params.customResources ? JSON.parse(params.customResources) : []
    };
    
    return createTraversalSheet(resetNumber, planData);
  } catch (error) {
    return { error: 'Failed to create sheet: ' + error.toString() };
  }
}

function createTraversalSheet(resetNumber, planData) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = CONFIG.TRAVERSAL_PREFIX + resetNumber;
    
    // Check if sheet already exists
    let existingSheet = null;
    try {
      existingSheet = spreadsheet.getSheetByName(sheetName);
    } catch (e) {
      // Sheet doesn't exist, which is good
    }
    
    if (existingSheet) {
      return { error: 'Sheet already exists: ' + sheetName };
    }
    
    // Find template sheet
    let templateSheet = null;
    const allSheets = spreadsheet.getSheets();
    
    for (let sheet of allSheets) {
      const name = sheet.getName().toLowerCase();
      if (name.includes('template') || name === 'template') {
        templateSheet = sheet;
        break;
      }
    }
    
    if (!templateSheet && allSheets.length > 1) {
      templateSheet = allSheets[1];
    }
    
    if (!templateSheet) {
      return { error: 'No template sheet found. Please ensure you have a template sheet.' };
    }
    
    // Copy template sheet
    const newSheet = templateSheet.copyTo(spreadsheet);
    newSheet.setName(sheetName);
    
    // Setup template with plan data
    try {
      setupTemplateWithPlanData(newSheet, planData);
    } catch (setupError) {
      // Silent error handling
    }
    
    return {
      sheetName: sheetName,
      resetNumber: resetNumber,
      created: new Date().toISOString(),
      success: true
    };
  } catch (error) {
    return { error: 'Failed to create sheet: ' + error.toString() };
  }
}

function setupTemplateWithPlanData(sheet, planData) {
  try {
    const dataMapping = [
      { cell: 'B1', value: planData.resetNumber },
      { cell: 'B2', value: planData.planName },
      { cell: 'B3', value: planData.startDate ? new Date(planData.startDate) : new Date() },
      { cell: 'B4', value: planData.startingValues?.ooLifetime },
      { cell: 'B5', value: planData.startingValues?.fragsLifetime },
      { cell: 'B9', value: planData.startingValues?.borgeLevel },
      { cell: 'B10', value: planData.startingValues?.ozzyLevel },
      { cell: 'B11', value: planData.startingValues?.knoxLevel },
      { cell: 'B13', value: planData.goals?.oo },
      { cell: 'B14', value: planData.goals?.m0 },
      { cell: 'B15', value: planData.goals?.cells },
      { cell: 'B16', value: planData.goals?.mp },
      { cell: 'B17', value: planData.goals?.rp }
    ];
    
    dataMapping.forEach(({ cell, value }) => {
      if (value !== undefined && value !== null) {
        try {
          sheet.getRange(cell).setValue(value);
        } catch (e) {
          // Silent error handling
        }
      }
    });
    
    // TS Milestones handling
    if (planData.startingValues?.tsMilestones) {
      try {
        const tsFields = planData.startingValues.tsMilestones.split('/');
        if (tsFields.length >= 3) {
          sheet.getRange('B6').setValue(parseInt(tsFields[0]) || 0);
          sheet.getRange('B7').setValue(parseInt(tsFields[1]) || 0);
          sheet.getRange('B8').setValue(parseInt(tsFields[2]) || 0);
        }
      } catch (e) {
        // Silent error handling
      }
    }
  } catch (error) {
    // Silent error handling
  }
}

/**
 * KORRIGIERTE DAILY ENTRY Functions
 */
function handleAddDailyEntry(params) {
  try {
    const sheetName = params.sheetName;
    if (!sheetName) {
      return { error: 'Sheet name is required' };
    }
    
    console.log('=== DEBUGGING ENTRY PARAMETERS ===');
    console.log('Sheet name:', sheetName);
    
    // WICHTIG: Setze den aktiven Sheet-Context für Custom Resource Detection
    setActiveSheetName(sheetName);
    
    console.log('All parameters:', Object.keys(params));
    
    // Sammle alle entry_* Parameter
    const entryData = {};
    
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(key => {
        console.log(`Checking parameter: ${key}`);
        if (key && typeof key === 'string' && key.startsWith('entry_')) {
          // KORRIGIERT: Konvertiere entry_time_in_tr zurück zu 'time in tr'
          const fieldName = key.substring(6).replace(/_/g, ' ');
          console.log(`Converted ${key} -> "${fieldName}"`);
          entryData[fieldName] = params[key];
        }
      });
    }
    
    console.log('Final entry data:', entryData);
    
    if (Object.keys(entryData).length === 0) {
      return { error: 'No entry data provided' };
    }
    
    return addDailyEntry(sheetName, entryData);
  } catch (error) {
    return { error: 'Failed to add entry: ' + error.toString() };
  }
}

function addDailyEntry(sheetName, entryData) {
  try {
    console.log('=== INCOMING ENTRY DATA DEBUG ===');
    console.log('Sheet name:', sheetName);
    console.log('Raw entry data:', entryData);
    console.log('Entry data type:', typeof entryData);
    console.log('Entry data keys:', Object.keys(entryData || {}));
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      console.error('Sheet not found:', sheetName);
      return { error: 'Sheet not found: ' + sheetName };
    }
    
    // KORRIGIERT: Finde die nächste leere Zeile für Daten-Einträge
    const nextEmptyRow = findNextEmptyDataRow(sheet);
    console.log('Next empty row for data:', nextEmptyRow);
    
    // Benutzer-Eingaben verarbeiten mit DETAILED LOGGING
    let fieldsProcessed = 0;
    let fieldsWritten = 0;
    
    if (entryData && typeof entryData === 'object') {
      Object.entries(entryData).forEach(([key, value]) => {
        fieldsProcessed++;
        
        if (!key || key === null || key === undefined || typeof key !== 'string') {
          console.log(`Skipping invalid key: ${key}`);
          return;
        }
        
        if ((value === null || value === undefined || value === '') && value !== 0) {
          console.log(`Skipping empty value for: "${key}"`);
          return;
        }
        
        console.log(`Processing field: "${key}" = ${value}`);
        
        const column = getColumn(key);
        console.log(`Column lookup result: "${key}" -> ${column}`);
        
        if (column) {
          try {
            const cellAddress = column + nextEmptyRow;
            sheet.getRange(cellAddress).setValue(value);
            fieldsWritten++;
            console.log(`✓ Successfully wrote ${cellAddress} = ${value}`);
          } catch (error) {
            console.error(`✗ Error writing ${key} to column ${column}:`, error);
          }
        } else {
          console.warn(`✗ No column mapping found for: "${key}"`);
        }
      });
    }
    
    // OPTIONAL: Setze nur ein Timestamp in eine spezielle Spalte (z.B. Spalte C)
    try {
      const timestampColumn = 'C'; // Log Timestamp Spalte
      sheet.getRange(timestampColumn + nextEmptyRow).setValue(new Date());
      console.log(`Set timestamp in ${timestampColumn}${nextEmptyRow}`);
    } catch (timestampError) {
      console.log('Error setting timestamp:', timestampError);
    }
    
    console.log(`Summary: Processed ${fieldsProcessed} fields, wrote ${fieldsWritten} to sheet`);
    
    return {
      rowAdded: nextEmptyRow,
      fieldsProcessed: fieldsProcessed,
      fieldsWritten: fieldsWritten,
      timestamp: new Date().toISOString(),
      success: true
    };
  } catch (error) {
    console.error('Error in addDailyEntry:', error);
    return { error: 'Failed to add entry: ' + error.toString() };
  }
}

// NEUE HELPER FUNCTION: Finde nächste leere Datenzeile (ab Zeile 2)
function findNextEmptyDataRow(sheet) {
  try {
    // Beginne ab Zeile 2 (nach dem Header)
    const startRow = 2;
    
    // Prüfe die wichtigsten Daten-Spalten um die nächste leere Zeile zu finden
    const dataColumns = ['C', 'E', 'G', 'N']; // Log Timestamp, TR Timer, OO, Cells
    
    let nextEmptyRow = startRow;
    
    // Suche durch die Zeilen bis zu einer vernünftigen Grenze (z.B. 1000 Zeilen)
    for (let row = startRow; row <= 1000; row++) {
      let rowIsEmpty = true;
      
      // Prüfe alle wichtigen Spalten für diese Zeile
      for (const column of dataColumns) {
        try {
          const cellValue = sheet.getRange(column + row).getValue();
          if (cellValue && cellValue.toString().trim() !== '') {
            rowIsEmpty = false;
            break;
          }
        } catch (e) {
          // Fehler beim Lesen der Zelle ignorieren
        }
      }
      
      // Wenn alle wichtigen Spalten in dieser Zeile leer sind, haben wir unsere Zeile gefunden
      if (rowIsEmpty) {
        nextEmptyRow = row;
        break;
      }
    }
    
    console.log('Found next empty data row:', nextEmptyRow);
    return nextEmptyRow;
    
  } catch (error) {
    console.log('Error finding next empty data row, using fallback:', error);
    // Fallback: Verwende Zeile 2 wenn alles fehlschlägt
    return 2;
  }
}

/**
 * DATA RETRIEVAL Functions
 */
function getSheetData(sheetName) {
  try {
    console.log('=== GET SHEET DATA DEBUG ===');
    console.log('Requested sheet name:', sheetName);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      console.error('Sheet not found:', sheetName);
      console.log('Available sheets:', spreadsheet.getSheets().map(s => s.getName()));
      return { error: 'Sheet not found: ' + sheetName };
    }
    
    console.log('Sheet found:', sheet.getName());
    
    const lastRow = sheet.getLastRow();
    const lastCol = Math.min(sheet.getLastColumn(), 50);
    
    console.log('Sheet dimensions:', { lastRow, lastCol });
    
    if (lastRow < 1) {
      console.log('Empty sheet, returning empty data');
      return {
        headers: [],
        data: [],
        goals: {},
        lastUpdate: new Date().toISOString()
      };
    }
    
    let allData = [];
    if (lastRow >= 1 && lastCol > 0) {
      try {
        console.log('Reading data range: 1,1 to', lastRow, lastCol);
        const dataRange = sheet.getRange(1, 1, lastRow, lastCol);
        allData = dataRange.getValues() || [];
        console.log('Data read successfully, rows:', allData.length);
      } catch (dataError) {
        console.error('Error reading data range:', dataError);
        return { error: 'Failed to read sheet data: ' + dataError.toString() };
      }
    }
    
    const headers = allData.length > 0 ? allData[0] : [];
    const data = allData.length > 1 ? allData.slice(1) : [];
    
    console.log('Headers count:', headers.length);
    console.log('Data rows count:', data.length);
    console.log('Sample headers:', headers.slice(0, 10));
    
    let goals = {};
    try {
      goals = getGoalsFromTemplate(sheet);
      console.log('Goals extracted:', goals);
    } catch (goalError) {
      console.log('Error extracting goals:', goalError);
      goals = {};
    }
    
    const result = {
      headers: headers,
      data: data,
      goals: goals,
      lastUpdate: new Date().toISOString()
    };
    
    console.log('Final result summary:', {
      headersCount: result.headers.length,
      dataRowsCount: result.data.length,
      goalsCount: Object.keys(result.goals).length
    });
    
    return result;
  } catch (error) {
    console.error('Error in getSheetData:', error);
    return { error: 'Failed to get sheet data: ' + error.toString() };
  }
}

function getGoalsFromTemplate(sheet) {
  try {
    const goals = {};
    
    const goalMappings = {
      'B13': 'oo',
      'B14': 'm0', 
      'B15': 'cells',
      'B16': 'mp',
      'B17': 'rp'
    };
    
    Object.entries(goalMappings).forEach(([cell, goalType]) => {
      try {
        const goalValue = sheet.getRange(cell).getValue();
        goals[goalType] = goalValue || 0;
      } catch (cellError) {
        goals[goalType] = 0;
      }
    });
    
    return goals;
  } catch (error) {
    return {};
  }
}

function getResourceColumns(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return { error: 'Sheet not found: ' + sheetName };
    }
    
    const lastCol = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    return {
      resourceColumns: Object.keys(COLUMN_MAP),
      headers: headers
    };
  } catch (error) {
    return { error: 'Failed to get resource columns: ' + error.toString() };
  }
}

function handleUpdateCell(params) {
  try {
    const sheetName = params.sheetName;
    const rowIndex = parseInt(params.rowIndex);
    const columnName = params.columnName;
    const newValue = params.newValue;
    
    if (!sheetName) {
      return { error: 'Sheet name is required' };
    }
    
    if (!rowIndex || rowIndex < 2) {
      return { error: 'Invalid row index' };
    }
    
    if (!columnName) {
      return { error: 'Column name is required' };
    }
    
    console.log('=== UPDATE CELL DEBUG ===');
    console.log('Sheet name:', sheetName);
    console.log('Row index:', rowIndex);
    console.log('Column name:', columnName);
    console.log('New value:', newValue);
    
    const result = updateCell(sheetName, rowIndex, columnName, newValue);
    
    if (result.success) {
      console.log('✅ Cell update successful');
      return result;
    } else {
      console.error('❌ Cell update failed:', result.error);
      return result;
    }
  } catch (error) {
    console.error('💥 Error in handleUpdateCell:', error);
    return { error: 'Failed to update cell: ' + error.toString() };
  }
}

function updateCell(sheetName, rowIndex, columnName, newValue) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return { error: 'Sheet not found: ' + sheetName };
    }
    
    // Setze den aktiven Sheet-Context
    setActiveSheetName(sheetName);
    
    // Finde die Spalte für den Column Name
    const column = getColumn(columnName);
    
    if (!column) {
      return { error: 'Column not found for: ' + columnName };
    }
    
    console.log(`Updating ${column}${rowIndex} with value: ${newValue}`);
    
    // Update die Zelle
    const cellAddress = column + rowIndex;
    
    // Konvertiere den Wert basierend auf dem Typ
    let valueToSet = newValue;
    
    // Versuche Zahlen zu konvertieren
    if (newValue && !isNaN(newValue) && newValue.toString().trim() !== '') {
      valueToSet = parseFloat(newValue);
    }
    
    sheet.getRange(cellAddress).setValue(valueToSet);
    
    console.log(`✅ Successfully updated ${cellAddress} = ${valueToSet}`);
    
    return {
      success: true,
      cellAddress: cellAddress,
      oldValue: null, // Könnte man vorher lesen, falls nötig
      newValue: valueToSet,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error in updateCell:', error);
    return { error: 'Failed to update cell: ' + error.toString() };
  }
}

