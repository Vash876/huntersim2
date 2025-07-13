import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTRTrackingStore = defineStore('trTracking', () => {
  // State
  const isSheetConnected = ref(false);
  const sheetUrl = ref('');
  const sheetInfo = ref(null);
  const trackingPlans = ref([]);
  const activeTrackingPlan = ref(null);
  const connectionError = ref(null);
  const isLoading = ref(false);

  // Computed
  const activePlansCount = computed(() => {
    return trackingPlans.value.filter(plan => plan.status === 'active').length;
  });

  const completedPlansCount = computed(() => {
    return trackingPlans.value.filter(plan => plan.status === 'completed').length;
  });

  const totalTrackingDays = computed(() => {
    return trackingPlans.value.reduce((total, plan) => {
      return total + (plan.daysActive || 0);
    }, 0);
  });

  const hasActiveConnection = computed(() => {
    const connected = isSheetConnected.value && sheetUrl.value && !connectionError.value;
    console.log('hasActiveConnection check:', {
      isSheetConnected: isSheetConnected.value,
      hasSheetUrl: !!sheetUrl.value,
      sheetUrl: sheetUrl.value,
      hasConnectionError: !!connectionError.value,
      result: connected
    });
    return connected;
  });

  // Actions

  /**
   * Load connection state from localStorage
   */
  function loadConnectionState() {
    try {
      const saved = localStorage.getItem('tr-tracking-connection');
      if (saved) {
        const data = JSON.parse(saved);
        isSheetConnected.value = data.connected || false;
        sheetUrl.value = data.url || '';
        sheetInfo.value = data.sheetInfo || null;
        
        // Validate connection is still working
        if (isSheetConnected.value && sheetUrl.value) {
          validateConnection();
        }
      }
    } catch (error) {
      console.error('Error loading connection state:', error);
      resetConnection();
    }
  }

  /**
   * Save connection state to localStorage
   */
  function saveConnectionState() {
    try {
      const data = {
        connected: isSheetConnected.value,
        url: sheetUrl.value,
        sheetInfo: sheetInfo.value,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('tr-tracking-connection', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving connection state:', error);
    }
  }

  function postWithJSONP(url, data) {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonp_post_callback_' + Date.now();
      const script = document.createElement('script');
      
      // Set up callback
      window[callbackName] = function(response) {
        resolve(response);
        document.head.removeChild(script);
        delete window[callbackName];
      };
      
      // Handle errors
      script.onerror = function() {
        reject(new Error('JSONP POST request failed'));
        document.head.removeChild(script);
        delete window[callbackName];
      };
      
      // Create request URL with data as query params
      const params = new URLSearchParams({
        action: data.action,
        resetNumber: data.resetNumber,
        startDate: data.startDate, // NEU: startDate hinzufügen!
        planName: data.planName,
        goals: JSON.stringify(data.goals),
        startingValues: JSON.stringify(data.startingValues),
        customResources: JSON.stringify(data.customResources),
        callback: callbackName
      });
      
      script.src = url + '?' + params.toString();
      document.head.appendChild(script);
      
      // Timeout after 15 seconds
      setTimeout(() => {
        if (window[callbackName]) {
          reject(new Error('JSONP POST request timeout'));
          document.head.removeChild(script);
          delete window[callbackName];
        }
      }, 15000);
    });
  }

  function fetchWithJSONP(url) {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonp_callback_' + Date.now();
      const script = document.createElement('script');
      
      window[callbackName] = function(response) {
        resolve(response);
        document.head.removeChild(script);
        delete window[callbackName];
      };
      
      script.onerror = () => reject(new Error('JSONP failed'));
      script.src = url + '&callback=' + callbackName;
      document.head.appendChild(script);
      
      setTimeout(() => {
        if (window[callbackName]) {
          reject(new Error('JSONP timeout'));
          document.head.removeChild(script);
          delete window[callbackName];
        }
      }, 10000);
    });
  }

  /**
   * Connect to Google Sheet
   */
  async function connectSheet(connectionData) {
    try {
      isLoading.value = true;
      connectionError.value = null;

      // Save connection data IMMEDIATELY
      isSheetConnected.value = true;
      sheetUrl.value = connectionData.url;
      sheetInfo.value = connectionData.sheetInfo;
      
      console.log('Store: Saved sheet URL:', sheetUrl.value); // Debug log
      
      saveConnectionState();
      
      // Optional: Test the connection
      const isValid = await validateSheetConnection(connectionData.url);
      if (!isValid) {
        console.warn('Connection validation failed, but continuing...');
      }
      
      // Load existing tracking plans
      await loadTrackingPlans();

      return true;
    } catch (error) {
      console.error('Error connecting sheet:', error);
      connectionError.value = error.message;
      // Don't reset connection on error, keep the URL
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Disconnect from Google Sheet
   */
  function disconnectSheet() {
    isSheetConnected.value = false;
    sheetUrl.value = '';
    sheetInfo.value = null;
    trackingPlans.value = [];
    activeTrackingPlan.value = null;
    connectionError.value = null;
    
    // Clear localStorage
    localStorage.removeItem('tr-tracking-connection');
    localStorage.removeItem('tr-tracking-plans');
  }

  /**
   * Reset connection state
   */
  function resetConnection() {
    isSheetConnected.value = false;
    sheetUrl.value = '';
    sheetInfo.value = null;
    connectionError.value = null;
  }

  /**
   * Validate existing connection
   */
  async function validateConnection() {
    if (!sheetUrl.value) return false;

    try {
      const response = await fetch(sheetUrl.value + '?action=validateConnection', {
        method: 'GET',
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data.connected) {
        connectionError.value = null;
        // Update sheet info if needed
        if (data.data.spreadsheetName) {
          sheetInfo.value = {
            ...sheetInfo.value,
            name: data.data.spreadsheetName,
            sheetCount: data.data.sheetCount,
            trackingPlans: data.data.traversalSheets
          };
          saveConnectionState();
        }
        return true;
      } else {
        throw new Error('Connection validation failed');
      }
    } catch (error) {
      console.error('Connection validation failed:', error);
      connectionError.value = 'Connection lost: ' + error.message;
      return false;
    }
  }

  /**
   * Validate sheet connection URL
   */
  async function validateSheetConnection(url) {
    try {
      const response = await fetch(url + '?action=validateConnection', {
        method: 'GET',
        mode: 'cors'
      });

      if (!response.ok) return false;
      
      const data = await response.json();
      return data.success && data.data.connected;
    } catch (error) {
      console.error('Sheet validation failed:', error);
      return false;
    }
  }

  /**
   * Load tracking plans from sheet
   */
  async function loadTrackingPlans() {
    console.log('=== LOADING TRACKING PLANS ===');
    
    if (!hasActiveConnection.value) {
      console.log('❌ No active sheet connection');
      return;
    }

    isLoading.value = true;
    
    try {
      console.log('📡 Fetching tracking plans from sheet...');
      
      const requestData = {
        action: 'getTraversalSheets'
      };

      const result = await postEntryWithJSONP(sheetUrl.value, requestData);
      console.log('📨 Raw plans result:', result);
      
      if (result && result.success && result.data && result.data.sheets) {
        console.log('✅ Plans loaded successfully:', result.data.sheets.length);
        
        // NEU: Transformiere zu Tracking Plans mit Resources UND korrigierter Entry-Anzahl
        const transformedPlans = await Promise.all(
          result.data.sheets.map(async (sheet) => {
            // KORRIGIERT: Berechne Resources für diesen Plan (inkl. _realEntryCount)
            const resourcesData = await calculatePlanResources(sheet.name);
            const realEntryCount = resourcesData._realEntryCount || 0;
            const realPlanName = await getPlanNameFromSheet(sheet.name);
            
            // Entferne _realEntryCount aus resources
            const { _realEntryCount, ...resources } = resourcesData;
            
            const plan = {
              id: sheet.name,
              name: realPlanName,
              resetNumber: sheet.resetNumber,
              status: 'active',
              daysActive: realEntryCount, // KORRIGIERT: Verwende echte Entry-Anzahl
              entriesCount: realEntryCount, // KORRIGIERT: Verwende echte Entry-Anzahl
              lastUpdate: sheet.lastModified,
              createdAt: sheet.lastModified,
              goals: {},
              totalGoals: 0,
              goalsAchieved: 0,
              resources: resources // Ohne _realEntryCount
            };
            
            return plan;
          })
        );
        
        trackingPlans.value = transformedPlans;
        console.log('📊 Transformed tracking plans:', transformedPlans);
        
        saveTrackingPlansCache();
      } else {
        console.error('❌ Invalid plans response:', result);
        trackingPlans.value = [];
      }
    } catch (error) {
      console.error('💥 Error loading tracking plans:', error);
      trackingPlans.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function getPlanNameFromSheet(sheetName) {
    try {
      const url = sheetUrl.value + '?action=getSheetData&sheetName=' + encodeURIComponent(sheetName);
      
      const response = await fetch(url, { method: 'GET', mode: 'cors' });
      const data = response.ok ? await response.json() : await fetchWithJSONP(url);
      
      if (data?.success && data?.data?.data && data.data.data.length > 0) {
        // Erste Zeile der Daten = Row 2, Spalte B = Index 1
        const planName = data.data.data[0]?.[1];
        return planName ? planName.toString().trim() : null;
      }
    } catch (error) {
      console.error('Error getting plan name:', error);
    }
    
    return null;
  }

  /**
   * NEUE FUNCTION: Berechne Resources für einen Plan
   */
  async function calculatePlanResources(planId) {
    try {
      const url = sheetUrl.value + '?action=getSheetData&sheetName=' + encodeURIComponent(planId);
      
      let data;
      try {
        const response = await fetch(url, { method: 'GET', mode: 'cors' });
        data = response.ok ? await response.json() : await fetchWithJSONP(url);
      } catch {
        data = await fetchWithJSONP(url);
      }
      
      if (!data?.success || !data?.data?.data) {
        return { cells: { current: 0, highest: 0 }, mp: { current: 0, highest: 0 }, shards: { current: 0, highest: 0 }, rp: { current: 0, highest: 0 }, ap: { current: 0, highest: 0 } };
      }
      
      const resources = { cells: { current: 0, highest: 0 }, mp: { current: 0, highest: 0 }, shards: { current: 0, highest: 0 }, rp: { current: 0, highest: 0 }, ap: { current: 0, highest: 0 } };
      
      // KORRIGIERT: Finde Spalten-Indizes mit spezifischen MP-Varianten
      const headers = data.data.headers;
      const cellsIndex = headers.findIndex(h => h && h.toString().toLowerCase().includes('cells'));
      
      // KORRIGIERT: MP mit mehreren Varianten wie in PlanView
      let mpIndex = -1;
      const mpVariants = ['MP (Accumulated)', 'MP', 'mp', 'MP on Hand', 'MP (Accum)', 'mp accumulated'];
      for (const variant of mpVariants) {
        mpIndex = headers.findIndex(h => {
          if (!h) return false;
          const headerLower = h.toString().toLowerCase().trim();
          const variantLower = variant.toLowerCase().trim();
          return headerLower === variantLower;
        });
        if (mpIndex !== -1) {
          console.log(`Found MP column with variant "${variant}" at index ${mpIndex}`);
          break;
        }
      }
      
      const shardsIndex = headers.findIndex(h => h && h.toString().toLowerCase().includes('shards'));
      const rpIndex = headers.findIndex(h => h && h.toString().toLowerCase().includes('rp'));
      const apIndex = headers.findIndex(h => h && h.toString().toLowerCase().includes('ap'));
      
      console.log('Column indices:', { cellsIndex, mpIndex, shardsIndex, rpIndex, apIndex });
      
      // KORRIGIERT: Zähle nur echte Entries (mit Timestamp)
      let realEntryCount = 0;
      
      // Durchlaufe alle Datenzeilen
      data.data.data.forEach(row => {
        // KORRIGIERT: Prüfe auf echten Timestamp-Wert (nicht nur formatierte Zelle)
        const timestamp = row[2]; // Spalte C (Log Timestamp)
        const hasRealTimestamp = timestamp && 
                                timestamp.toString().trim() !== '' && 
                                timestamp.toString().trim() !== 'undefined' &&
                                timestamp.toString().trim() !== 'null';
        
        if (!hasRealTimestamp) return; // Skip leere oder formatierte Zeilen
        
        // Diese Zeile hat echte Daten
        realEntryCount++;
        
        [
          { key: 'cells', index: cellsIndex },
          { key: 'mp', index: mpIndex },
          { key: 'shards', index: shardsIndex },
          { key: 'rp', index: rpIndex },
          { key: 'ap', index: apIndex }
        ].forEach(({ key, index }) => {
          if (index !== -1) {
            const value = parseFloat(row[index]);
            if (!isNaN(value) && value > 0) {
              resources[key].current = value;
              if (value > resources[key].highest) {
                resources[key].highest = value;
              }
            }
          }
        });
      });
      
      console.log(`Resources calculated for ${planId}:`, resources);
      console.log(`Real entry count for ${planId}: ${realEntryCount}`);
      
      // KORRIGIERT: Gib auch die echte Entry-Anzahl zurück
      return {
        ...resources,
        _realEntryCount: realEntryCount
      };
    } catch (error) {
      console.error(`Error calculating resources for ${planId}:`, error);
      return { cells: { current: 0, highest: 0 }, mp: { current: 0, highest: 0 }, shards: { current: 0, highest: 0 }, rp: { current: 0, highest: 0 }, ap: { current: 0, highest: 0 }, _realEntryCount: 0 };
    }
  }

  /**
   * Load detailed data for all tracking plans
   */
  async function loadTrackingPlansDetails() {
    const detailPromises = trackingPlans.value.map(async (plan) => {
      try {
        const response = await fetch(sheetUrl.value + `?action=getSheetData&sheetName=${encodeURIComponent(plan.id)}`, {
          method: 'GET',
          mode: 'cors'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Update plan with detailed data
            updatePlanWithSheetData(plan, data.data);
          }
        }
      } catch (error) {
        console.error(`Error loading details for ${plan.id}:`, error);
      }
    });

    await Promise.allSettled(detailPromises);
  }

  /**
   * Update plan object with sheet data
   */
  function updatePlanWithSheetData(plan, sheetData) {
    // Update goals
    plan.goals = sheetData.goals || {};
    plan.totalGoals = Object.keys(plan.goals).length;

    // Update resources (get latest values from data)
    if (sheetData.data && sheetData.data.length > 0) {
      const latestEntry = sheetData.data[sheetData.data.length - 1];
      const headers = sheetData.headers;
      
      plan.resources = {};
      headers.forEach((header, index) => {
        if (['cells', 'mp', 'shards', 'rp'].includes(header.toLowerCase())) {
          const current = latestEntry[index] || 0;
          const start = sheetData.data[0] ? sheetData.data[0][index] || 0 : 0;
          
          plan.resources[header.toLowerCase()] = {
            current: current,
            start: start,
            gain: current - start
          };
        }
      });

      // Calculate goals achieved
      plan.goalsAchieved = Object.entries(plan.goals).filter(([resource, goal]) => {
        const current = plan.resources[resource]?.current || 0;
        return current >= goal;
      }).length;

      // Update status based on goals
      if (plan.goalsAchieved === plan.totalGoals && plan.totalGoals > 0) {
        plan.status = 'completed';
      } else if (plan.entriesCount > 0) {
        plan.status = 'active';
      }
    }

    plan.lastUpdate = sheetData.lastUpdate || plan.lastUpdate;
  }

  /**
   * Create new tracking plan
   */
  async function createTrackingPlan(planData) {
    console.log('createTrackingPlan called with:', planData);
    console.log('Store state:', {
      isSheetConnected: isSheetConnected.value,
      sheetUrl: sheetUrl.value,
      connectionError: connectionError.value,
      hasActiveConnection: hasActiveConnection.value
    });

    if (!hasActiveConnection.value) {
      console.error('No active connection details:', {
        isSheetConnected: isSheetConnected.value,
        sheetUrl: sheetUrl.value,
        connectionError: connectionError.value
      });
      throw new Error('No active sheet connection');
    }

    try {
      isLoading.value = true;

      const requestData = {
        action: 'createTraversalSheet',
        resetNumber: planData.resetNumber,
        startDate: planData.startDate, // NEU: startDate hinzufügen!
        planName: planData.planName,
        goals: planData.goals,
        startingValues: planData.startingValues,
        customResources: planData.customResources
      };

      console.log('Creating tracking plan with JSONP including startDate:', requestData);

      // Use JSONP directly (skip POST attempt)
      const result = await postWithJSONP(sheetUrl.value, requestData);
      console.log('JSONP result:', result);
      
      if (result && result.success) {
        // Create local plan object
        const newPlan = {
          id: result.data.sheetName,
          name: planData.planName,
          resetNumber: planData.resetNumber,
          startDate: planData.startDate, // NEU: startDate speichern!
          status: 'new',
          daysActive: 0,
          entriesCount: 0,
          lastUpdate: new Date(),
          createdAt: new Date(),
          resources: {},
          goals: planData.goals || {},
          goalsAchieved: 0,
          totalGoals: Object.keys(planData.goals || {}).length,
          description: planData.description
        };

        // Add to store
        trackingPlans.value.push(newPlan);
        
        // Set as active plan
        activeTrackingPlan.value = newPlan;

        // Save cache
        saveTrackingPlansCache();

        console.log('Created new tracking plan with startDate:', newPlan);
        return newPlan;
      } else {
        throw new Error(result?.error || 'Failed to create tracking plan - no success response');
      }
    } catch (error) {
      console.error('Error creating tracking plan:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Delete tracking plan
   */
  async function deleteTrackingPlan(planId) {
    try {
      // Remove from local state immediately
      const planIndex = trackingPlans.value.findIndex(p => p.id === planId);
      if (planIndex > -1) {
        trackingPlans.value.splice(planIndex, 1);
      }

      if (activeTrackingPlan.value?.id === planId) {
        activeTrackingPlan.value = null;
      }

      // Save cache
      saveTrackingPlansCache();

      // Note: Google Sheets API doesn't easily allow sheet deletion
      // Users would need to manually delete sheets if desired
      
      return true;
    } catch (error) {
      console.error('Error deleting tracking plan:', error);
      throw error;
    }
  }

  /**
   * JSONP für addDailyEntry - KORRIGIERT!
   */
  function postEntryWithJSONP(url, data) {
    console.log('=== POST ENTRY WITH JSONP ===');
    console.log('📥 URL:', url);
    console.log('📥 Data:', data);
    
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonp_entry_callback_' + Date.now();
      console.log('🏷️ Callback name:', callbackName);
      
      const script = document.createElement('script');
      
      // Set up callback
      window[callbackName] = function(response) {
        console.log('📨 JSONP callback triggered with response:', response);
        resolve(response);
        document.head.removeChild(script);
        delete window[callbackName];
        console.log('🧹 Cleaned up callback and script');
      };
      
      // Handle errors
      script.onerror = function() {
        console.error('💥 JSONP script error');
        reject(new Error('JSONP POST request failed'));
        document.head.removeChild(script);
        delete window[callbackName];
      };
      
      // KORRIGIERTE Parameter-Erstellung
      const params = new URLSearchParams({
        action: data.action,
        sheetName: data.sheetName,
        callback: callbackName
      });
      
      console.log('📦 Base params:', {
        action: data.action,
        sheetName: data.sheetName,
        callback: callbackName
      });
      
      // Entry-Daten als separate Parameter hinzufügen
      if (data.entryData) {
        console.log('📦 Processing entry data for JSONP:', data.entryData);
        
        // Jedes Feld als entry_* Parameter hinzufügen
        Object.entries(data.entryData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            // KORRIGIERT: Verwende den Key direkt (da er schon der displayName ist)
            const paramName = `entry_${key.replace(/\s+/g, '_').toLowerCase()}`;
            params.append(paramName, value);
            console.log(`📎 Added param: ${paramName} = ${value} (from key: ${key})`);
          } else {
            console.log(`⏭️ Skipped param: ${key} (empty value: ${value})`);
          }
        });
      } else {
        console.warn('⚠️ No entryData to process');
      }
      
      const finalUrl = url + '?' + params.toString();
      console.log('🌐 Final JSONP URL:', finalUrl);
      console.log('📏 URL length:', finalUrl.length);
      
      script.src = finalUrl;
      document.head.appendChild(script);
      console.log('📄 Script added to DOM');
      
      // Timeout after 15 seconds
      setTimeout(() => {
        if (window[callbackName]) {
          console.error('⏰ JSONP request timeout');
          reject(new Error('JSONP POST request timeout'));
          document.head.removeChild(script);
          delete window[callbackName];
        }
      }, 15000);
    });
  }

  /**
   * Add daily entry with column-based mapping - KORRIGIERT!
   */
  async function addDailyEntry(planId, entryData) {
    console.log('=== STORE ADD DAILY ENTRY ===');
    console.log('📥 Store received planId:', planId);
    console.log('📥 Store received entryData:', entryData);
    console.log('🔍 hasActiveConnection:', hasActiveConnection.value);
    console.log('🔍 sheetUrl:', sheetUrl.value);
    console.log('🔍 isSheetConnected:', isSheetConnected.value);
    console.log('🔍 connectionError:', connectionError.value);
    
    if (!hasActiveConnection.value) {
      console.error('❌ No active connection');
      console.error('   - isSheetConnected:', isSheetConnected.value);
      console.error('   - sheetUrl:', sheetUrl.value);
      console.error('   - connectionError:', connectionError.value);
      throw new Error('No active sheet connection');
    }

    try {
      isLoading.value = true;
      console.log('📊 Set isLoading to true');

      console.log('📦 Preparing request data...');
      const requestData = {
        action: 'addDailyEntry',
        sheetName: planId,
        entryData: entryData
      };

      console.log('📦 Request data prepared:', requestData);
      console.log('🌐 Using sheet URL:', sheetUrl.value);

      console.log('🚀 Calling postEntryWithJSONP...');
      const result = await postEntryWithJSONP(sheetUrl.value, requestData);
      console.log('📨 JSONP result received:', result);
      
      if (result && result.success) {
        console.log('✅ Entry added successfully');
        
        // Update local plan
        const plan = trackingPlans.value.find(p => p.id === planId);
        if (plan) {
          console.log('📊 Updating local plan:', plan.name);
          plan.entriesCount++;
          plan.daysActive++;
          plan.lastUpdate = new Date();
          plan.status = 'active';
          console.log('📊 Plan updated:', plan);
        } else {
          console.warn('⚠️ Plan not found in local store:', planId);
        }

        // Save cache
        saveTrackingPlansCache();
        console.log('💾 Cache saved');

        return result;
      } else {
        console.error('❌ Entry failed:', result?.error || 'No success response');
        throw new Error(result?.error || 'Failed to add entry');
      }
    } catch (error) {
      console.error('💥 Error in store addDailyEntry:', error);
      console.error('💥 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    } finally {
      console.log('🏁 Setting isLoading to false');
      isLoading.value = false;
    }
  }

  /**
   * Set active tracking plan
   */
  function setActiveTrackingPlan(planId) {
    const plan = trackingPlans.value.find(p => p.id === planId);
    if (plan) {
      activeTrackingPlan.value = plan;
    }
  }

  /**
   * Save tracking plans to cache
   */
  function saveTrackingPlansCache() {
    try {
      const cache = {
        plans: trackingPlans.value,
        activePlanId: activeTrackingPlan.value?.id || null,
        cachedAt: new Date().toISOString()
      };
      localStorage.setItem('tr-tracking-plans', JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving plans cache:', error);
    }
  }

  /**
   * Load tracking plans from cache
   */
  function loadTrackingPlansCache() {
    try {
      const cached = localStorage.getItem('tr-tracking-plans');
      if (cached) {
        const data = JSON.parse(cached);
        trackingPlans.value = data.plans || [];
        
        if (data.activePlanId) {
          activeTrackingPlan.value = trackingPlans.value.find(p => p.id === data.activePlanId) || null;
        }
      }
    } catch (error) {
      console.error('Error loading plans cache:', error);
    }
  }

  /**
   * Clear all data
   */
  function clearAllData() {
    isSheetConnected.value = false;
    sheetUrl.value = '';
    sheetInfo.value = null;
    trackingPlans.value = [];
    activeTrackingPlan.value = null;
    connectionError.value = null;
    
    localStorage.removeItem('tr-tracking-connection');
    localStorage.removeItem('tr-tracking-plans');
  }

  return {
    // State
    isSheetConnected,
    sheetUrl,
    sheetInfo,
    trackingPlans,
    activeTrackingPlan,
    connectionError,
    isLoading,

    // Computed
    activePlansCount,
    completedPlansCount,
    totalTrackingDays,
    hasActiveConnection,

    // Actions
    loadConnectionState,
    connectSheet,
    disconnectSheet,
    validateConnection,
    loadTrackingPlans,
    createTrackingPlan,
    deleteTrackingPlan,
    addDailyEntry,
    setActiveTrackingPlan,
    clearAllData
  };
});