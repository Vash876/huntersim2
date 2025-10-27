/**
 * Storage Check Utility
 * Monitors localStorage usage and provides safe storage operations
 */

/**
 * Detects actual localStorage limit by attempting to write test data
 * @returns {number} Limit in KB
 */
function detectLocalStorageLimit() {
  try {
    // Try to detect actual limit by binary search
    const testKey = '__limit_test__';
    let low = 0;
    let high = 10 * 1024; // Start with 10MB max
    let detectedLimit = 5 * 1024; // Default fallback: 5MB
    
    // Quick test: try 10MB
    try {
      const testData = 'x'.repeat(10 * 1024 * 1024);
      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);
      detectedLimit = 10 * 1024; // 10MB
    } catch {
      // 10MB failed, assume 5MB
      detectedLimit = 5 * 1024;
    }
    
    return detectedLimit;
  } catch (e) {
    // If detection fails, return conservative 5MB
    return 5 * 1024;
  }
}

/**
 * Checks localStorage quota and returns usage statistics
 * @returns {Promise<Object>} { available: boolean, sizeKB: number, sizeMB: number, percentage: number, warning: boolean, limitMB: number }
 */
export async function checkLocalStorageQuota() {
  try {
    // Test if localStorage is available
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    
    // Calculate current storage usage
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += (localStorage[key].length + key.length) * 2; // UTF-16 = 2 bytes per char
      }
    }
    
    // Convert to KB/MB
    const sizeKB = totalSize / 1024;
    const sizeMB = sizeKB / 1024;
    
    // Try to use StorageManager API (modern browsers)
    let actualLimitKB = 5 * 1024; // Fallback: 5MB
    
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        // estimate.quota is in bytes
        if (estimate.quota) {
          // Some browsers report overall quota (includes IndexedDB etc.)
          // localStorage typically gets 5-10MB of that
          // If quota is very large (>100MB), assume localStorage gets 10MB
          // Otherwise use conservative 5MB
          actualLimitKB = estimate.quota > 100 * 1024 * 1024 ? 10 * 1024 : 5 * 1024;
        }
      } catch (e) {
        console.log('StorageManager API failed, using detection method');
      }
    }
    
    // If StorageManager API not available, try detection
    if (actualLimitKB === 5 * 1024) {
      actualLimitKB = detectLocalStorageLimit();
    }
    
    const percentage = (sizeKB / actualLimitKB) * 100;
    
    const result = {
      available: true,
      sizeKB: parseFloat(sizeKB.toFixed(2)),
      sizeMB: parseFloat(sizeMB.toFixed(2)),
      limitMB: actualLimitKB / 1024,
      percentage: parseFloat(percentage.toFixed(1)),
      warning: percentage > 80, // Warn at 80% capacity (more conservative)
      critical: percentage > 95 // Critical at 95%
    };
    
    if (result.warning) {
      console.warn(`⚠️ LocalStorage usage: ${result.percentage}% (${result.sizeMB} MB / ${result.limitMB} MB limit)`);
    } else {
      console.log(`✅ LocalStorage usage: ${result.percentage}% (${result.sizeMB} MB / ${result.limitMB} MB limit)`);
    }
    
    return result;
  } catch (e) {
    console.error('❌ LocalStorage not available:', e);
    return {
      available: false,
      error: e.message,
      warning: true,
      critical: true
    };
  }
}

/**
 * Safe setItem with quota error handling
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 * @returns {boolean} Success status
 */
export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.error('❌ LocalStorage quota exceeded!');
      return false;
    }
    console.error('❌ LocalStorage error:', e);
    throw e;
  }
}

/**
 * Get list of storage keys sorted by size (largest first)
 * @returns {Array<{key: string, sizeKB: number}>}
 */
export function getStorageItemsBySize() {
  const items = [];
  
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = (localStorage[key].length + key.length) * 2;
        items.push({
          key,
          sizeKB: parseFloat((size / 1024).toFixed(2))
        });
      }
    }
    
    return items.sort((a, b) => b.sizeKB - a.sizeKB);
  } catch (e) {
    console.error('Error getting storage items:', e);
    return [];
  }
}
