// useButtonControls.js
import { ref } from 'vue'

export function useButtonControls({ getLevel, updateLevel }) {

  const DELAY_MS = 400
  const INTERVAL_MS = 30

  // Speichert Timer (Timeout + Interval) je Button-ID
  const activeTimers = ref({})

  // Touch-Status für mobile (um Scrollen von Long-Press zu unterscheiden)
  const touchStatus = ref({
    isTouch: false,
    startX: 0,
    startY: 0,
    isScrolling: false,
    scrollThreshold: 10
  })

  // Flag, ob bei Touch bereits ein Long-Press ausgelöst wurde
  const longPressFired = ref({})

  /**
   * Stoppt alle Timer für ein bestimmtes Item.
   */
  function stopTimers(item) {
    if (!item?.id) return
    const buttonId = item.id

    if (activeTimers.value[buttonId]) {
      if (activeTimers.value[buttonId].timeout) {
        clearTimeout(activeTimers.value[buttonId].timeout)
      }
      if (activeTimers.value[buttonId].interval) {
        clearInterval(activeTimers.value[buttonId].interval)
      }
      delete activeTimers.value[buttonId]
    }

    // Long-Press-Flag zurücksetzen
    longPressFired.value[buttonId] = false
  }

  /**
   * Aktionen: increment / decrement / incrementFast / decrementFast
   */
  function increment(item) {
    if (item.type === 'modifiedStat') {
      // Direkter Aufruf der increment-Methode des Items
      if (typeof item.max === 'number' && item.getLevel && item.getLevel() >= item.max) {
        // Bereits am Maximum
        return;
      }
      item.increment();
      return;
    }
  
    const itemLevel = getLevel(item);
    const maxLevel = item.maxLevel !== undefined ? item.maxLevel : Infinity;
    const step = item.step || 1;
    
    if (itemLevel < maxLevel) {
      updateLevel(item, Math.min(itemLevel + step, maxLevel));
    }
  }

  function decrement(item) {
    if (item.type === 'modifiedStat') {
      // Direkter Aufruf der decrement-Methode des Items
      if (item.getLevel && item.getLevel() <= 0) {
        // Bereits am Minimum
        return;
      }
      item.decrement();
      return;
    }

    const itemLevel = getLevel(item);
    const step = item.step || 1;
    if (itemLevel > 0) {
      updateLevel(item, Math.max(itemLevel - step, 0));
    }
  }

  function incrementFast(item) {
    if (item.type === 'modifiedStat') {
      // Direkter Aufruf der incrementFast-Methode des Items
      if (typeof item.max === 'number' && item.getLevel && item.getLevel() >= item.max) {
        // Bereits am Maximum
        return;
      }
      item.incrementFast();
      return;
    }
  
    const itemLevel = getLevel(item);
    const maxLevel = item.maxLevel !== undefined ? item.maxLevel : Infinity;
    const step = item.step || 1;
    updateLevel(item, Math.min(itemLevel + (step * 10), maxLevel));
  }

  function decrementFast(item) {
    if (item.type === 'modifiedStat') {
      // Direkter Aufruf der decrementFast-Methode des Items
      if (item.getLevel && item.getLevel() <= 0) {
        // Bereits am Minimum
        return;
      }
      item.decrementFast();
      return;
    }

    const itemLevel = getLevel(item);
    const step = item.step || 1;
    updateLevel(item, Math.max(itemLevel - (step * 10), 0));
  }

  /**
   * Startet die eigentliche Aktion (einfacher Klick + Long-Press + Auto-Repeat).
   */
  function startAction(item, event, actionFn) {
    if (!item) return;
    
    // Für modifiedStat-Items einen spezifischen Button-ID generieren
    const buttonId = item.type === 'modifiedStat' ? `modified_${item.key}` : item.id;
    
    if (!buttonId) return;
    
    // Vorher sicherheitshalber alte Timer stoppen
    stopTimers(item);
    
    const isTouch = event?.type === 'touchstart';

    if (isTouch) {
      // Touch: erst Verzögerung für Long-Press
      touchStatus.value.isTouch = true;
      touchStatus.value.startX = event.touches[0].clientX;
      touchStatus.value.startY = event.touches[0].clientY;
      touchStatus.value.isScrolling = false;
      longPressFired.value[buttonId] = false;

      activeTimers.value[buttonId] = {
        actionFn,
        timeout: setTimeout(() => {
          // Wenn nicht gescrollt wurde, jetzt Long-Press starten
          if (!touchStatus.value.isScrolling && activeTimers.value[buttonId]) {
            actionFn(item); // einmal ausführen
            longPressFired.value[buttonId] = true;
            // Auto-Repeat mit Grenzwertprüfung bei jedem Tick
            activeTimers.value[buttonId].interval = setInterval(() => {
              // Prüfe Grenzen je nach Aktion
              if ((actionFn === increment || actionFn === incrementFast) && 
                  item.maxLevel !== undefined) {
                // Bei increment/incrementFast prüfen, ob maxLevel erreicht ist
                const currentLevel = getLevel(item);
                if (currentLevel >= item.maxLevel) {
                  stopTimers(item);
                  return;
                }
              } else if (actionFn === decrement || actionFn === decrementFast) {
                // Bei decrement/decrementFast prüfen, ob 0 erreicht ist
                const currentLevel = getLevel(item);
                if (currentLevel <= 0) {
                  stopTimers(item);
                  return;
                }
              }
              
              // Aktion ausführen, wenn Grenzen nicht erreicht
              actionFn(item);
            }, INTERVAL_MS);
          }
        }, DELAY_MS)
      };
    } else {
      // Maus: Aktion sofort einmal ausführen
      actionFn(item);

      // Dann Timer-Logik starten
      activeTimers.value[buttonId] = {
        actionFn,
        timeout: setTimeout(() => {
          if (activeTimers.value[buttonId]) {
            // Auto-Repeat mit Grenzwertprüfung bei jedem Tick
            activeTimers.value[buttonId].interval = setInterval(() => {
              // Prüfe Grenzen je nach Aktion
              if ((actionFn === increment || actionFn === incrementFast) && 
                  item.maxLevel !== undefined) {
                // Bei increment/incrementFast prüfen, ob maxLevel erreicht ist
                const currentLevel = getLevel(item);
                if (currentLevel >= item.maxLevel) {
                  stopTimers(item);
                  return;
                }
              } else if (actionFn === decrement || actionFn === decrementFast) {
                // Bei decrement/decrementFast prüfen, ob 0 erreicht ist
                const currentLevel = getLevel(item);
                if (currentLevel <= 0) {
                  stopTimers(item);
                  return;
                }
              }
              
              // Aktion ausführen, wenn Grenzen nicht erreicht
              actionFn(item);
            }, INTERVAL_MS);
          }
        }, DELAY_MS)
      };
    }
  }

  // Wird vom Button per @mousedown / @touchstart aufgerufen
  function handleStart(event, actionFn, item) {
    if (!event || !actionFn || !item) return
    startAction(item, event, actionFn)
  }

  // Wird vom Button per @mouseup / @touchend / @touchcancel etc. aufgerufen
  function handleEnd(event, item) {
    if (!item) return
    const buttonId = item.id

    // Bei Touch: Wenn kein Long-Press ausgelöst wurde, Aktion noch 1x ausführen
    if ((event.type === 'touchend' || event.type === 'touchcancel') && activeTimers.value[buttonId]) {
      if (!longPressFired.value[buttonId]) {
        clearTimeout(activeTimers.value[buttonId].timeout)
        activeTimers.value[buttonId].actionFn(item)
      }
      touchStatus.value.isTouch = false
      touchStatus.value.isScrolling = false
    }

    // Timer stoppen
    stopTimers(item)
  }

  // Wird vom Button per @touchmove aufgerufen
  function handleTouchMove(event, item) {
    if (!event || !item || !touchStatus.value.isTouch) return
    try {
      const touch = event.touches[0]
      const deltaX = Math.abs(touch.clientX - touchStatus.value.startX)
      const deltaY = Math.abs(touch.clientY - touchStatus.value.startY)

      // Wenn sich der Finger zu stark bewegt → User scrollt → abbrechen
      if (deltaX > touchStatus.value.scrollThreshold || deltaY > touchStatus.value.scrollThreshold) {
        touchStatus.value.isScrolling = true
        stopTimers(item)
      }
    } catch (e) {
      console.error('handleTouchMove Error:', e)
    }
  }

  // Diese Funktionen und Handler stellst du dann der Umgebung bereit
  return {
    // Haupt-Handler
    handleStart,
    handleEnd,
    handleTouchMove,

    // Increment / Decrement
    increment,
    decrement,
    incrementFast,
    decrementFast
  }
}
