/** @OnlyCurrentDoc */

/**
 * Optimized Orb Purchase Auto-Optimizer
 * 
 * Key optimizations:
 * - Batch API calls and sheet updates  
 * - Smart flushing to prevent stale cost data
 * - Strict budget tracking to prevent overspend
 * - Comprehensive profiling for performance monitoring
 */

/**
 * Simple profiler to track execution times and bottlenecks
 */
class Profiler {
    constructor() {
      this.timers = new Map();
      this.results = [];
      this.apiCallCount = 0;
      this.flushCount = 0;
    }
    
    start(label) {
      this.timers.set(label, new Date().getTime());
    }
    
    end(label) {
      const startTime = this.timers.get(label);
      if (startTime) {
        const duration = new Date().getTime() - startTime;
        this.results.push({
          operation: label,
          duration: duration,
          timestamp: new Date()
        });
        this.timers.delete(label);
        return duration;
      }
      return 0;
    }
    
    countApiCall(operation = 'API Call') {
      this.apiCallCount++;
    }
    
    countFlush() {
      this.flushCount++;
    }
    
    getReport() {
      const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
      const sortedResults = this.results.sort((a, b) => b.duration - a.duration);
      
      let report = `\n🔍 PERFORMANCE PROFILING REPORT\n`;
      report += `Total Execution Time: ${totalTime}ms (${(totalTime/1000).toFixed(2)}s)\n`;
      report += `Total API Calls: ${this.apiCallCount}\n`;
      report += `Total Flush Calls: ${this.flushCount}\n\n`;
      
      report += `📊 TIME BREAKDOWN (slowest first):\n`;
      sortedResults.forEach((result, index) => {
        const percentage = ((result.duration / totalTime) * 100).toFixed(1);
        report += `${index + 1}. ${result.operation}: ${result.duration}ms (${percentage}%)\n`;
      });
      
      // Performance recommendations
      report += `\n💡 PERFORMANCE RECOMMENDATIONS:\n`;
      if (this.apiCallCount > 50) {
        report += `• High API call count (${this.apiCallCount}) - consider more batching\n`;
      }
      if (this.flushCount > 10) {
        report += `• Many flush calls (${this.flushCount}) - reduce frequency\n`;
      }
      
      const batchReadTime = sortedResults.find(r => r.operation.includes('Batch Read'));
      if (batchReadTime && batchReadTime.duration > totalTime * 0.3) {
        report += `• Batch reading takes ${((batchReadTime.duration/totalTime)*100).toFixed(1)}% of time - optimize data access\n`;
      }
      
      return report;
    }
  }
  
  /**
   * Creates custom menu when the spreadsheet opens
   */
  function onOpen() {
    buildOptimizerMenu();
  }
  
  function buildOptimizerMenu() {
    const ui = SpreadsheetApp.getUi();
    const skip = getSkipConfirmSetting();
    
    ui.createMenu('🔮 Orb Optimizer')
      .addItem('⚡ Optimize with Efficiency/Cost', 'optimizeOrbPurchases')
      .addItem('⚡ Optimize (Efficiency Only)', 'optimizeOrbPurchasesEfficiencyOnly')
      .addSeparator()
      .addItem('🔄 Undo All Purchases', 'undoAllPurchases')
      .addSeparator()
      .addItem('🛒 Apply planned Purchases', 'applyPlannedPurhcases')
      .addSeparator()
      .addSubMenu(
        ui.createMenu('Settings')
          .addItem(`Don’t ask for confirmation: ${skip ? 'ON' : 'OFF'}`, 'toggleDontAskAgain')
      )
      .addToUi();
  }
  
  function toggleDontAskAgain() {
    const props = PropertiesService.getUserProperties();
    const current = props.getProperty('OPTIMIZER_SKIP_CONFIRM') === 'true';
    const next = (!current).toString();
    props.setProperty('OPTIMIZER_SKIP_CONFIRM', next);
    const ui = SpreadsheetApp.getUi();
    buildOptimizerMenu();
  }
  
  /**
   * Undos all purchases by resetting upgrade levels to 0
   */
  function undoAllPurchases() {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const ui = SpreadsheetApp.getUi();
      
      // Confirm before resetting (unless disabled)
      if (!getSkipConfirmSetting()) {
        const response = ui.alert(
          'Confirm Undo All Purchases',
          'This will reset ALL upgrade levels to 0. Continue?',
          ui.ButtonSet.YES_NO
        );
        if (response !== ui.Button.YES) {
          return;
        }
      }
      
      // Batch update all ranges to 0
      const updates = [
        {range: 'T10:T16', values: Array(7).fill([0])},
        {range: 'T19:T24', values: Array(6).fill([0])},
        {range: 'T28:T35', values: Array(8).fill([0])},
        {range: 'T38:T40', values: Array(3).fill([0])},
        {range: 'T43:T53', values: Array(11).fill([0])},
        {range: 'T56:T64', values: Array(9).fill([0])},
        {range: 'T67:T70', values: Array(4).fill([0])}
      ];
      
      // Batch update all ranges
      updates.forEach(update => {
        sheet.getRange(update.range).setValues(update.values);
      });
      
      // Set BN46 (gem toggle) to FALSE
      sheet.getRange('T9').setValue(false);
      sheet.getRange('T18').setValue(false);
      sheet.getRange('T26').setValue(false);
      sheet.getRange('T37').setValue(false);
      sheet.getRange('T42').setValue(false);
      sheet.getRange('T55').setValue(false);
      sheet.getRange('T66').setValue(false);
      
  
      // Clear optimization results
      sheet.getRange('AJ9:AO1000').clear();
      
      // Force recalculation
      SpreadsheetApp.flush();
      
    } catch (error) {
      console.error('Error in undo:', error);
      SpreadsheetApp.getUi().alert('Error', `An error occurred: ${error.message}`, SpreadsheetApp.getUi().ButtonSet.OK);
    }
  }
  
  /**
   * Applys planned purchases
   */
  function applyPlannedPurhcases() {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const ui = SpreadsheetApp.getUi();

      
      // Confirm before resetting
      const response = ui.alert(
        'Confirm Apply plan',
        'This will reset all planned purchases to 0 and add them to your current upgrades',
        ui.ButtonSet.YES_NO
      );
      
      if (response !== ui.Button.YES) {
        return;
      }
      
      // Batch update all ranges to 0
      const updates = [
      {rangeBN: 'T10:T16', rangeBJ: 'P10:P16'},
      {rangeBN: 'T19:T24', rangeBJ: 'P19:P24'},
      {rangeBN: 'T27:T35', rangeBJ: 'P27:P35'},
      {rangeBN: 'T38:T40', rangeBJ: 'P38:P40'},
      {rangeBN: 'T43:T53', rangeBJ: 'P43:P53'},
      {rangeBN: 'T56:T64', rangeBJ: 'P56:P64'},
      {rangeBN: 'T67:T70', rangeBJ: 'P67:P70'}
    ];
  
    updates.forEach(update => {
      const bnValues = sheet.getRange(update.rangeBN).getValues();
      const bjValues = sheet.getRange(update.rangeBJ).getValues();
  
      const result = bnValues.map((row, i) => {
        const bn = row[0] || 0;
        const bj = bjValues[i][0] || 0;
        return [bn + bj];
      });
  
      sheet.getRange(update.rangeBJ).setValues(result);
    });
  
    //apply gem purhcases
    const rows = [9, 18, 26, 37, 42, 55, 66]; // Rows of Gem qualities
  
    rows.forEach(row => {
      const isChecked = sheet.getRange(`T${row}`).getValue();
      
      if (isChecked === true) {
        const currentValue = sheet.getRange(`P${row}`).getValue() || 0;
        sheet.getRange(`P${row}`).setValue(currentValue + 1);
        sheet.getRange(`T${row}`).setValue(false);
      }
    });
  
    // Batch update all ranges to 0
      const updates2 = [
        {range: 'T10:T16', values: Array(7).fill([0])},
        {range: 'T19:T24', values: Array(6).fill([0])},
        {range: 'T27:T35', values: Array(9).fill([0])},
        {range: 'T38:T40', values: Array(3).fill([0])},
        {range: 'T43:T53', values: Array(11).fill([0])},
        {range: 'T56:T64', values: Array(9).fill([0])},
        {range: 'T67:T70', values: Array(4).fill([0])}
      ];
      
      // Batch update all ranges
      updates2.forEach(update => {
        sheet.getRange(update.range).setValues(update.values);
      });
  
      // Set BN46 (gem toggle) to FALSE
      sheet.getRange('T9').setValue(false);
      sheet.getRange('T18').setValue(false);
      sheet.getRange('T26').setValue(false);
      sheet.getRange('T37').setValue(false);
      sheet.getRange('T42').setValue(false);
      sheet.getRange('T55').setValue(false);
      sheet.getRange('T66').setValue(false);
      
      // Clear optimization results
      sheet.getRange('AJ9:AO1000').clear();
      
      // Force recalculation
      SpreadsheetApp.flush();
      
    } catch (error) {
      console.error('Error in undo:', error);
      SpreadsheetApp.getUi().alert('Error', `An error occurred: ${error.message}`, SpreadsheetApp.getUi().ButtonSet.OK);
    }
  }
  
  /**
   * Main optimization function - OPTIMIZED VERSION WITH PROFILING
   */
  function optimizeOrbPurchases() {
    const profiler = new Profiler();
    profiler.start('Total Execution');
    
    try {
      profiler.start('Initial Setup');
      const sheet = SpreadsheetApp.getActiveSheet();
      profiler.countApiCall('Get Active Sheet');
      const k79 = sheet.getRange("K79").getValue();

      if (k79 == "Missing Funds:") {
        SpreadsheetApp.getUi().alert("Error: Cannot proceed with a negative budget. Increase orb budget or take away some planned purchases");
        return;
      }
      
      // Confirm before starting (unless disabled)
      const ui = SpreadsheetApp.getUi();
      if (!getSkipConfirmSetting()) {
        const response = ui.alert(
          'Confirm Auto-Optimization',
          'This will automatically purchase upgrades using the default strategy, until orb budget runs out',
          ui.ButtonSet.YES_NO
        );
        if (response !== ui.Button.YES) {
          return;
        }
      }
      
      // Configuration
      const START_ROW = 10;
      const END_ROW = 70;
      const TOTAL_ROWS = END_ROW - START_ROW + 1;
      
      // Column indices (0-based)
      const COL_INDICES = {
        UPGRADE_NAME: columnToNumber('K') - 1,
        CURRENT_LEVEL: columnToNumber('P') - 1,
        UPGRADE_AMOUNT: columnToNumber('T') - 1,
        NEXT_COST: columnToNumber('U') - 1,
        EFFICIENCY: columnToNumber('AG') - 1
      };
      profiler.end('Initial Setup');
      
      // Get initial orb values
      profiler.start('Read Initial Orb Values');
      const savedOrbs = parseValue(sheet.getRange('Q5').getValue()) || 0;
      profiler.countApiCall('Read Q5 (Saved Orbs)');
      const accumulatedOrbs = parseValue(sheet.getRange('Q6').getValue()) || 0;
      profiler.countApiCall('Read Q6 (Accumulated Orbs)');
      const surplusOrbs = parseValue(sheet.getRange('S79').getValue()) || 0;
      profiler.countApiCall('Read Q6 (Accumulated Orbs)');
      let availableOrbs = surplusOrbs;
      profiler.end('Read Initial Orb Values');
      
      console.log(`Starting optimization with ${formatNumber(availableOrbs)} orbs...`);
      
      const results = [];
      let totalSpent = 0;
      let iteration = 0;
      const maxIterations = 100;
      
      // Track current upgrade levels in memory
      const upgradeStates = new Map();
      
      // Initial batch read of upgrade amounts
      profiler.start('Initial Upgrade Amounts Read');
      const upgradeAmountRange = sheet.getRange(START_ROW, COL_INDICES.UPGRADE_AMOUNT + 1, TOTAL_ROWS, 1);
      const initialAmounts = upgradeAmountRange.getValues();
      profiler.countApiCall('Batch Read Initial Upgrade Amounts');
      profiler.end('Initial Upgrade Amounts Read');
      
      for (let i = 0; i < TOTAL_ROWS; i++) {
        upgradeStates.set(START_ROW + i, initialAmounts[i][0]);
      }
      
      profiler.start('Main Optimization Loop');
      let batchPurchases = []; // Track purchases in current batch
      let batchUpgradeRows = new Set(); // Track which upgrade rows we've bought in current batch
      
      while (iteration < maxIterations) {
        iteration++;
        profiler.start(`Iteration ${iteration}`);
        
        // Batch read all necessary data
        profiler.start(`Iteration ${iteration} - Batch Read`);
        const requiredCols = [
          COL_INDICES.UPGRADE_NAME,   // BD
          COL_INDICES.CURRENT_LEVEL,  // BJ
          COL_INDICES.UPGRADE_AMOUNT, // BN
          COL_INDICES.NEXT_COST,      // BO
          COL_INDICES.EFFICIENCY      // CA
        ];
  
        // Build A1-notation ranges for each column (e.g. "BD10:BD55")
        const rangeStrings = requiredCols.map(idx => {
          const colLetter = numberToColumn(idx + 1);
          return `${colLetter}${START_ROW}:${colLetter}${END_ROW}`;
        });
  
        // Read all five ranges in one server round-trip
        const ranges = sheet.getRangeList(rangeStrings).getRanges();
        profiler.countApiCall(`Batch Read 5 Columns (Iteration ${iteration})`);
  
        // Extract the column arrays (each is TOTAL_ROWS × 1)
        const [
          upgradeNameCol,      // BD
          currentLevelCol,     // BJ
          upgradeAmountCol,    // BN
          nextCostCol,         // BO
          efficiencyCol        // CA
        ] = ranges.map(r => r.getValues());
        profiler.end(`Iteration ${iteration} - Batch Read`);
        
        // Parse upgrade data from batch read
        profiler.start(`Iteration ${iteration} - Parse Data`);
        const upgrades = [];
        for (let i = 0; i < TOTAL_ROWS; i++) {
          const row = START_ROW + i;
          
          const name         = upgradeNameCol[i][0];
          const currentLevel = currentLevelCol[i][0];
          const cost         = parseValue(nextCostCol[i][0]);
          const efficiency   = parseValue(efficiencyCol[i][0]);
  
          
          if (!name || !cost || cost <= 0 || !efficiency) continue;
          
          upgrades.push({
            row: row,
            name: name,
            currentLevel: currentLevel,
            cost: cost,
            efficiency: efficiency
          });
        }
        profiler.end(`Iteration ${iteration} - Parse Data`);
        
        // Find the best affordable upgrade, prioritizing different upgrade types
        profiler.start(`Iteration ${iteration} - Find Best Upgrade`);
        const bestUpgrade = findBestAffordableUpgrade(upgrades, availableOrbs, batchUpgradeRows);
        profiler.end(`Iteration ${iteration} - Find Best Upgrade`);
        
        if (!bestUpgrade) {
          console.log('Optimization complete - no more affordable upgrades found.');
          profiler.end(`Iteration ${iteration}`);
          break;
        }
        
        // Make the purchase
        profiler.start(`Iteration ${iteration} - Process Purchase`);
        
        // Double-check affordability (safety check)
        if (bestUpgrade.cost > availableOrbs) {
          console.error(`Budget error: Trying to spend ${formatNumber(bestUpgrade.cost)} but only ${formatNumber(availableOrbs)} orbs available.`);
          profiler.end(`Iteration ${iteration} - Process Purchase`);
          profiler.end(`Iteration ${iteration}`);
          break;
        }
        
        availableOrbs -= bestUpgrade.cost;
        totalSpent += bestUpgrade.cost;
        
        // Record the purchase
        const levelChange = `${bestUpgrade.currentLevel} → ${bestUpgrade.currentLevel + 1}`;
        
        results.push({
          iteration: iteration,
          upgrade: bestUpgrade.name,
          fromLevel: bestUpgrade.currentLevel,
          toLevel: bestUpgrade.currentLevel + 1,
          levelChange: levelChange,
          cost: bestUpgrade.cost,
          efficiency: bestUpgrade.efficiency,
          remainingOrbs: availableOrbs
        });
        
        // Add to batch tracking (don't update sheet yet)
        const newValue = (upgradeStates.get(bestUpgrade.row) || 0) + 1;
        batchPurchases.push({
          row: bestUpgrade.row,
          value: newValue
        });
        batchUpgradeRows.add(bestUpgrade.row);
        
        // Update in-memory state
        upgradeStates.set(bestUpgrade.row, newValue);
        profiler.end(`Iteration ${iteration} - Process Purchase`);
        
        // Flush when we have 5 different upgrades OR no more new upgrades available OR max iterations
        const noNewUpgrades = !findBestAffordableUpgrade(upgrades, availableOrbs, batchUpgradeRows);
        const shouldFlush = batchUpgradeRows.size >= 5 || noNewUpgrades || iteration >= maxIterations;
        
        if (noNewUpgrades && batchPurchases.length > 0) {
          // Force flush to get updated costs
        }
        
        if (shouldFlush && batchPurchases.length > 0) {
          // Batch update all purchases at once
          profiler.start(`Iteration ${iteration} - Batch Sheet Update (${batchUpgradeRows.size} upgrades)`);
          
          // Prepare batch update data
          const batchRanges = [];
          const batchValues = [];
          
          for (const purchase of batchPurchases) {
            const range = sheet.getRange(purchase.row, COL_INDICES.UPGRADE_AMOUNT + 1);
            batchRanges.push(range);
            batchValues.push([[purchase.value]]);
          }
          
          // Update all ranges at once
          sheet.getRangeList(batchRanges.map(r => r.getA1Notation())).getRanges().forEach((range, index) => {
            range.setValues(batchValues[index]);
          });
          
          profiler.countApiCall(`Batch Update ${batchPurchases.length} Upgrades`);
          profiler.end(`Iteration ${iteration} - Batch Sheet Update (${batchUpgradeRows.size} upgrades)`);
          
          profiler.start(`Iteration ${iteration} - Flush (${batchUpgradeRows.size} upgrades)`);
          SpreadsheetApp.flush();
          profiler.countFlush();
          profiler.end(`Iteration ${iteration} - Flush (${batchUpgradeRows.size} upgrades)`);
          
          // Reset batch tracking
          batchPurchases = [];
          batchUpgradeRows.clear();
        }
        
        profiler.end(`Iteration ${iteration}`);
      }
      profiler.end('Main Optimization Loop');
      
      // Final budget validation
      const finalAvailableOrbs = savedOrbs + accumulatedOrbs - totalSpent;
      if (totalSpent > savedOrbs + accumulatedOrbs) {
        console.error(`Budget exceeded! Spent ${formatNumber(totalSpent)} but only had ${formatNumber(savedOrbs + accumulatedOrbs)} orbs.`);
      } else {
        console.log(`✅ Optimization completed successfully. Spent ${formatNumber(totalSpent)} orbs, ${formatNumber(finalAvailableOrbs)} remaining.`);
      }
      
      // Output results using batch operations
      profiler.start('Output Results');
      outputResultsOptimized(sheet, results, totalSpent, availableOrbs, profiler);
      profiler.end('Output Results');
      
      profiler.end('Total Execution');
      
      // Show clean completion message
      const completionMessage = `Optimization Complete! 🎉
  
  🔮 Purchases Made: ${results.length} upgrades
  💰 Total Spent: ${formatNumber(totalSpent)} orbs  
  💎 Remaining: ${formatNumber(availableOrbs)} orbs
  
  📊 Detailed results are available in columns AJ onwards.`;
      
      ui.alert('Optimization Complete', completionMessage, ui.ButtonSet.OK);
      
    } catch (error) {
      profiler.end('Total Execution');
      console.error('An error occurred during optimization:', error.message);
      SpreadsheetApp.getUi().alert('Error', `An error occurred: ${error.message}`, SpreadsheetApp.getUi().ButtonSet.OK);
    }
  }
  
  /**
   * Alternative optimization that uses efficiency-only greedy selector
   */
  function optimizeOrbPurchasesEfficiencyOnly() {
    const profiler = new Profiler();
    profiler.start('Total Execution');
    
    try {
      profiler.start('Initial Setup');
      const sheet = SpreadsheetApp.getActiveSheet();
      profiler.countApiCall('Get Active Sheet');
      
      const ui = SpreadsheetApp.getUi();
      if (!getSkipConfirmSetting()) {
        const response = ui.alert(
          'Confirm Auto-Optimization (Efficiency Only)',
          'This will automatically purchase upgrades, always picking the highest efficiency that is affordable, until orb budget runs out',
          ui.ButtonSet.YES_NO
        );
        if (response !== ui.Button.YES) {
          return;
        }
      }
      
      const START_ROW = 10;
      const END_ROW = 70;
      const TOTAL_ROWS = END_ROW - START_ROW + 1;
      
      const COL_INDICES = {
        UPGRADE_NAME: columnToNumber('K') - 1,
        CURRENT_LEVEL: columnToNumber('P') - 1,
        UPGRADE_AMOUNT: columnToNumber('T') - 1,
        NEXT_COST: columnToNumber('U') - 1,
        EFFICIENCY: columnToNumber('AG') - 1
      };
      profiler.end('Initial Setup');
      
      profiler.start('Read Initial Orb Values');
      const savedOrbs = parseValue(sheet.getRange('Q5').getValue()) || 0;
      profiler.countApiCall('Read Q5 (Saved Orbs)');
      const accumulatedOrbs = parseValue(sheet.getRange('Q6').getValue()) || 0;
      profiler.countApiCall('Read Q6 (Accumulated Orbs)');
      const surplusOrbs = parseValue(sheet.getRange('S79').getValue()) || 0;
      profiler.countApiCall('Read Q6 (Accumulated Orbs)');
      let availableOrbs = surplusOrbs;
      profiler.end('Read Initial Orb Values');
      
      const results = [];
      let totalSpent = 0;
      let iteration = 0;
      const maxIterations = 100;
      
      const upgradeStates = new Map();
      
      profiler.start('Initial Upgrade Amounts Read');
      const upgradeAmountRange = sheet.getRange(START_ROW, COL_INDICES.UPGRADE_AMOUNT + 1, TOTAL_ROWS, 1);
      const initialAmounts = upgradeAmountRange.getValues();
      profiler.countApiCall('Batch Read Initial Upgrade Amounts');
      profiler.end('Initial Upgrade Amounts Read');
      
      for (let i = 0; i < TOTAL_ROWS; i++) {
        upgradeStates.set(START_ROW + i, initialAmounts[i][0]);
      }
      
      profiler.start('Main Optimization Loop');
      let batchPurchases = [];
      let batchUpgradeRows = new Set();
      
      while (iteration < maxIterations) {
        iteration++;
        profiler.start(`Iteration ${iteration}`);
        
        profiler.start(`Iteration ${iteration} - Batch Read`);
        const requiredCols = [
          COL_INDICES.UPGRADE_NAME,
          COL_INDICES.CURRENT_LEVEL,
          COL_INDICES.UPGRADE_AMOUNT,
          COL_INDICES.NEXT_COST,
          COL_INDICES.EFFICIENCY
        ];
        const rangeStrings = requiredCols.map(idx => {
          const colLetter = numberToColumn(idx + 1);
          return `${colLetter}${START_ROW}:${colLetter}${END_ROW}`;
        });
        const ranges = sheet.getRangeList(rangeStrings).getRanges();
        profiler.countApiCall(`Batch Read 5 Columns (Iteration ${iteration})`);
        const [
          upgradeNameCol,
          currentLevelCol,
          upgradeAmountCol,
          nextCostCol,
          efficiencyCol
        ] = ranges.map(r => r.getValues());
        profiler.end(`Iteration ${iteration} - Batch Read`);
        
        profiler.start(`Iteration ${iteration} - Parse Data`);
        const upgrades = [];
        for (let i = 0; i < TOTAL_ROWS; i++) {
          const row = START_ROW + i;
          const name = upgradeNameCol[i][0];
          const currentLevel = currentLevelCol[i][0];
          const cost = parseValue(nextCostCol[i][0]);
          const efficiency = parseValue(efficiencyCol[i][0]);
          if (!name || !cost || cost <= 0 || !efficiency) continue;
          upgrades.push({ row, name, currentLevel, cost, efficiency });
        }
        profiler.end(`Iteration ${iteration} - Parse Data`);
        
        profiler.start(`Iteration ${iteration} - Find Best Upgrade`);
        const bestUpgrade = findBestAffordableUpgradeByEfficiency(upgrades, availableOrbs, batchUpgradeRows);
        profiler.end(`Iteration ${iteration} - Find Best Upgrade`);
        
        if (!bestUpgrade) {
          profiler.end(`Iteration ${iteration}`);
          break;
        }
        
        profiler.start(`Iteration ${iteration} - Process Purchase`);
        if (bestUpgrade.cost > availableOrbs) {
          profiler.end(`Iteration ${iteration} - Process Purchase`);
          profiler.end(`Iteration ${iteration}`);
          break;
        }
        availableOrbs -= bestUpgrade.cost;
        totalSpent += bestUpgrade.cost;
        const levelChange = `${bestUpgrade.currentLevel} → ${bestUpgrade.currentLevel + 1}`;
        results.push({
          iteration,
          upgrade: bestUpgrade.name,
          fromLevel: bestUpgrade.currentLevel,
          toLevel: bestUpgrade.currentLevel + 1,
          levelChange,
          cost: bestUpgrade.cost,
          efficiency: bestUpgrade.efficiency,
          remainingOrbs: availableOrbs
        });
        const newValue = (upgradeStates.get(bestUpgrade.row) || 0) + 1;
        batchPurchases.push({ row: bestUpgrade.row, value: newValue });
        batchUpgradeRows.add(bestUpgrade.row);
        upgradeStates.set(bestUpgrade.row, newValue);
        profiler.end(`Iteration ${iteration} - Process Purchase`);
        
        const noNewUpgrades = !findBestAffordableUpgradeByEfficiency(upgrades, availableOrbs, batchUpgradeRows);
        const shouldFlush = batchUpgradeRows.size >= 5 || noNewUpgrades || iteration >= maxIterations;
        if (shouldFlush && batchPurchases.length > 0) {
          profiler.start(`Iteration ${iteration} - Batch Sheet Update (${batchUpgradeRows.size} upgrades)`);
          const batchRanges = [];
          const batchValues = [];
          for (const purchase of batchPurchases) {
            const range = sheet.getRange(purchase.row, COL_INDICES.UPGRADE_AMOUNT + 1);
            batchRanges.push(range);
            batchValues.push([[purchase.value]]);
          }
          sheet.getRangeList(batchRanges.map(r => r.getA1Notation())).getRanges().forEach((range, index) => {
            range.setValues(batchValues[index]);
          });
          profiler.countApiCall(`Batch Update ${batchPurchases.length} Upgrades`);
          profiler.end(`Iteration ${iteration} - Batch Sheet Update (${batchUpgradeRows.size} upgrades)`);
          profiler.start(`Iteration ${iteration} - Flush (${batchUpgradeRows.size} upgrades)`);
          SpreadsheetApp.flush();
          profiler.countFlush();
          profiler.end(`Iteration ${iteration} - Flush (${batchUpgradeRows.size} upgrades)`);
          batchPurchases = [];
          batchUpgradeRows.clear();
        }
        profiler.end(`Iteration ${iteration}`);
      }
      profiler.end('Main Optimization Loop');
      const finalAvailableOrbs = savedOrbs + accumulatedOrbs - totalSpent;
      if (totalSpent > savedOrbs + accumulatedOrbs) {
      } else {
      }
      profiler.start('Output Results');
      outputResultsOptimized(sheet, results, totalSpent, availableOrbs, profiler);
      profiler.end('Output Results');
      profiler.end('Total Execution');
      const completionMessage = `Optimization Complete! 🎉\n\n🔮 Purchases Made: ${results.length} upgrades\n💰 Total Spent: ${formatNumber(totalSpent)} orbs  \n💎 Remaining: ${formatNumber(availableOrbs)} orbs\n\n📊 Detailed results are available in columns AJ onwards.`;
      ui.alert('Optimization Complete', completionMessage, ui.ButtonSet.OK);
    } catch (error) {
      profiler.end('Total Execution');
      console.error('An error occurred during optimization:', error.message);
      SpreadsheetApp.getUi().alert('Error', `An error occurred: ${error.message}`, SpreadsheetApp.getUi().ButtonSet.OK);
    }
  }
  
  /**
   * Finds the best affordable upgrade based on efficiency
   * Prioritizes upgrades not yet purchased in current batch
   */
  function findBestAffordableUpgrade(upgrades, availableOrbs, batchUpgradeRows = new Set()) {
    let bestUpgrade = null;
    let bestEfficiency = 0;
    
    for (const upgrade of upgrades) {
      if (upgrade.cost > availableOrbs) continue;
      
      // Only consider upgrades NOT in current batch to avoid stale cost issues
      if (!batchUpgradeRows.has(upgrade.row)) {
        if (upgrade.efficiency > bestEfficiency) {
          bestEfficiency = upgrade.efficiency;
          bestUpgrade = upgrade;
        }
      }
    }
    
    // Don't use fallback - if we can't afford any new upgrade types, 
    // force a flush to get updated costs rather than risk overspend
    return bestUpgrade;
  }
  
  /**
   * Greedy selector that picks the highest-efficiency affordable upgrade only
   * Does not divide by cost; ignores upgrades already chosen in the current batch
   */
  function findBestAffordableUpgradeByEfficiency(upgrades, availableOrbs, batchUpgradeRows = new Set()) {
    let bestUpgrade = null;
    let bestEfficiency = 0;
    
    for (const upgrade of upgrades) {
      if (upgrade.cost > availableOrbs) continue;
      if (!batchUpgradeRows.has(upgrade.row)) {
        if (upgrade.efficiency > bestEfficiency) {
          bestEfficiency = upgrade.efficiency;
          bestUpgrade = upgrade;
        }
      }
    }
    
    return bestUpgrade;
  }
  
  /**
   * Outputs optimization results to the sheet using batch operations
   */
  function outputResultsOptimized(sheet, results, totalSpent, remainingOrbs, profiler) {
    const outputStartCol = columnToNumber('AJ');
    const outputStartRow = 9;
    
    // Clear previous results
    profiler.start('Clear Previous Results');
    sheet.getRange(outputStartRow, outputStartCol, 1000, 7).clear();
    profiler.countApiCall('Clear Results Range');
    profiler.end('Clear Previous Results');
    
    // Prepare all data for batch write
    profiler.start('Prepare Output Data');
    const outputData = [];
    
    // Headers
    outputData.push(['🔮 Optimization Results', '', '', '', '', '']);
    outputData.push(['Iteration', 'Upgrade', 'Level Change', 'Cost', 'Efficiency', 'Remaining']);
    
    // Results data
    for (const result of results) {
      outputData.push([
        result.iteration,
        result.upgrade,
        result.levelChange,
        result.cost,
        result.efficiency,
        result.remainingOrbs
      ]);
    }
    
    // Totals row under respective columns (Cost, Efficiency only)
    const totalCost = results.reduce((sum, r) => sum + (r.cost || 0), 0);
    const totalEfficiency = results.reduce((sum, r) => sum + (r.efficiency || 0), 0);
    outputData.push(['', '', 'Totals', totalCost, totalEfficiency, '']);
    
    // Add empty row
    outputData.push(['', '', '', '', '', '']);
    
    // Summary
    outputData.push(['📊 SUMMARY', '', '', '', '', '']);
    outputData.push(['Total Purchases:', results.length, '', '', '', '']);
    outputData.push(['Total Spent:', totalSpent, '', '', '', '']);
    outputData.push(['Remaining Orbs:', remainingOrbs, '', '', '', '']);
    profiler.end('Prepare Output Data');
    
    // Batch write all data at once
    profiler.start('Write Results to Sheet');
    const outputRange = sheet.getRange(outputStartRow, outputStartCol, outputData.length, 6);
    outputRange.setValues(outputData);
    profiler.countApiCall(`Batch Write Results (${outputData.length} rows)`);
    profiler.end('Write Results to Sheet');
  }
  
  // ===== UTILITY FUNCTIONS =====
  
  function parseValue(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const str = value.replace(/,/g, '');
      
      if (str.includes('E+') || str.includes('e+')) {
        return parseFloat(str);
      }
      
      const multipliers = {
        'K': 1e3, 'M': 1e6, 'B': 1e9, 'T': 1e12,
        'Q': 1e15, 'QI': 1e18, 'SX': 1e21, 'SP': 1e24,
        'OC': 1e27, 'NO': 1e30, 'DC': 1e33
      };
      
      // Check for multi-character suffixes first
      for (let len = 2; len >= 1; len--) {
        const suffix = str.slice(-len).toUpperCase();
        if (multipliers[suffix]) {
          return parseFloat(str.slice(0, -len)) * multipliers[suffix];
        }
      }
      
      return parseFloat(str);
    }
    return 0;
  }
  
  function formatNumber(num) {
    const formats = [
      {value: 1e33, suffix: 'DC'},
      {value: 1e30, suffix: 'NO'},
      {value: 1e27, suffix: 'OC'},
      {value: 1e24, suffix: 'SP'},
      {value: 1e21, suffix: 'SX'},
      {value: 1e18, suffix: 'QI'},
      {value: 1e15, suffix: 'Q'},
      {value: 1e12, suffix: 'T'},
      {value: 1e9, suffix: 'B'},
      {value: 1e6, suffix: 'M'},
      {value: 1e3, suffix: 'K'}
    ];
    
    for (const format of formats) {
      if (num >= format.value) {
        return (num / format.value).toFixed(2) + format.suffix;
      }
    }
    
    return num.toFixed(2);
  }
  
  function columnToNumber(column) {
    let result = 0;
    for (let i = 0; i < column.length; i++) {
      result = result * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    return result;
  }
  
  /**
   * Converts a 1-based column number to its A-Z letter(s).
   * Example: 1 → 'A', 27 → 'AA'
   */
  function numberToColumn(n) {
    let col = '';
    while (n > 0) {
      const r = (n - 1) % 26;
      col = String.fromCharCode(65 + r) + col;
      n = Math.floor((n - 1) / 26);
    }
    return col;
  }
  
  // ===== SETTINGS HELPERS =====
  function getSkipConfirmSetting() {
    const props = PropertiesService.getUserProperties();
    return props.getProperty('OPTIMIZER_SKIP_CONFIRM') === 'true';
  }