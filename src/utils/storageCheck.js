/**
 * Storage Check Utility
 * Monitors localStorage usage and provides safe storage operations
 */

/**
 * Checks localStorage quota and returns usage statistics
 * @returns {Object} { available: boolean, sizeKB: number, sizeMB: number, percentage: number, warning: boolean }
 */
export function checkLocalStorageQuota() {
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
    
    // Most browsers have 5-10MB limit, we'll assume 5MB as conservative estimate
    const estimatedLimit = 5 * 1024; // 5MB in KB
    const percentage = (sizeKB / estimatedLimit) * 100;
    
    const result = {
      available: true,
      sizeKB: parseFloat(sizeKB.toFixed(2)),
      sizeMB: parseFloat(sizeMB.toFixed(2)),
      percentage: parseFloat(percentage.toFixed(1)),
      warning: percentage > 95, // Warn at 95% capacity
      critical: percentage > 98 // Critical at 98%
    };
    
    if (result.warning) {
      console.warn(`⚠️ LocalStorage usage: ${result.percentage}% (${result.sizeMB} MB)`);
    } else {
      console.log(`✅ LocalStorage usage: ${result.percentage}% (${result.sizeMB} MB)`);
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
