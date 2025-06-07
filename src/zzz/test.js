function initData() {
  try {
    error.value = null;
    trSteps.length = 0;
    initDateTimePicker();

    // *** LEGACY GEM MAPPING - HIER AM ANFANG ***
    mapLegacyGemBoosts();

    // Basis‑Stats aus props kopieren
    const baseStats = {
      ...props.currentStats,
      trCount:     props.currentStats.trCount     || 0,
      allTimeOrbs: props.currentStats.allTimeOrbs || 0
    };

    // ───────────────────────── erster Step ─────────────────────────
    let firstStep;
    if (props.editPlanId) {
      const plan = trPlannerStore.getTRPlanById(props.editPlanId);
      if (!plan) throw new Error('Plan nicht gefunden');

      // Meta‑Infos
      planName.value    = plan.name;
      trStartDate.value = plan.trStartDate || trStartDate.value;
      trStartTime.value = plan.trStartTime || trStartTime.value;

      trCount.value        = plan.updatedStats?.trCount     ?? baseStats.trCount;
      trCountDisplay.value = String(trCount.value);
      allTimeOrbs.value    = plan.updatedStats?.allTimeOrbs ?? baseStats.allTimeOrbs;
      allTimeOrbsDisplay.value = formatSuffixNotation(allTimeOrbs.value);

      const statsWithOrbCalcFlags = {
        ...baseStats,
        trCount:     trCount.value,
        allTimeOrbs: allTimeOrbs.value
      };
      
      // Wenn der gespeicherte Plan _orbCalcMaxedBoosts enthält, übernimm es
      if (plan.updatedStats && plan.updatedStats._orbCalcMaxedBoosts) {
        statsWithOrbCalcFlags._orbCalcMaxedBoosts = {...plan.updatedStats._orbCalcMaxedBoosts};
        console.log("Wiederhergestellte _orbCalcMaxedBoosts-Flags:", statsWithOrbCalcFlags._orbCalcMaxedBoosts);
      }

      firstStep = {
        id: `step_${Date.now()}`,
        stats: statsWithOrbCalcFlags,
        targetLevels:      {},
        targetBools:       {},
        selectedForNextTR: Array.isArray(plan.selectedForNextTR)
                           ? [...plan.selectedForNextTR]
                           : ['hoursInTR']
      };
      if (!firstStep.selectedForNextTR.includes('hoursInTR'))
        firstStep.selectedForNextTR.push('hoursInTR');

      // Boosts aus plan.boosts übernehmen
      plan.boosts.forEach(b => {
        if (b.type === 'number') {
          firstStep.targetLevels[b.key] = b.targetLevel;
          firstStep.stats[b.key]        = b.targetLevel;
        } else if (b.type === 'boolean') {
          const boostDef = allBoosts.find(x => x.key === b.key);
          const state = Boolean(b.targetState);
          firstStep.targetBools[b.key] = state;
          firstStep.stats[b.key]       = state ? 1 : (boostDef?.permanent ? firstStep.stats[b.key] || 0 : 0);
        }
      });
    } else {
      // Neuer Plan
      const statsWithFlags = { ...baseStats };

      if (props.currentStats && props.currentStats._orbCalcMaxedBoosts) {
        statsWithFlags._orbCalcMaxedBoosts = {...props.currentStats._orbCalcMaxedBoosts};
        console.log("Übernommene _orbCalcMaxedBoosts-Flags aus currentStats:", statsWithFlags._orbCalcMaxedBoosts);
      }

      firstStep = {
        id: `step_${Date.now()}`,
        stats: statsWithFlags,
        targetLevels: {},
        targetBools:  {},
        selectedForNextTR: ['hoursInTR']
      };
    }

    trSteps.push(firstStep);

    // ───────────────────────── Chain‑Schritte ─────────────────────────
    if (props.editPlanId) {
      const plan = trPlannerStore.getTRPlanById(props.editPlanId);
      if (Array.isArray(plan.trChain) && plan.trChain.length) {
        let acc = { ...firstStep.stats };
        acc.trCount++;
        acc.allTimeOrbs += getStepOrbGains(firstStep);

        plan.trChain.forEach((chain, idx) => {
          const step = {
            id: `chain_${Date.now()}_${idx}`,
            stats: { ...acc },
            targetLevels:      {},
            targetBools:       {},
            selectedForNextTR: Array.isArray(chain.selectedForNextTR)
                               ? [...chain.selectedForNextTR]
                               : ['hoursInTR']
          };
          if (!step.selectedForNextTR.includes('hoursInTR'))
            step.selectedForNextTR.push('hoursInTR');

          // ---------------- numerische Boosts ----------------
          chain.boosts
            .filter(b => b.type === 'number')
            .forEach(b => {
              step.targetLevels[b.key] = b.targetLevel;
              step.stats[b.key]        = b.targetLevel;
            });

          // ---------------- Boolean‑Boosts (Fix!) ----------------
          chain.boosts
            .filter(b => b.type === 'boolean')      // KEIN selectedForNextTR‑Filter mehr
            .forEach(b => {
              const def   = allBoosts.find(x => x.key === b.key);
              const state = Boolean(b.targetState);

              step.targetBools[b.key] = state;

              // stats korrekt auf 0/1 setzen
              if (def?.permanent) {
                if (state) step.stats[b.key] = 1;
              } else {
                step.stats[b.key] = state ? 1 : 0;
              }

              // UI‑Merker ergänzen, falls noch nicht vorhanden
              if (!step.selectedForNextTR.includes(b.key)) {
                step.selectedForNextTR.push(b.key);
              }
            });

          // ----- Boolean‑Reset: unmarkierte, nicht‑permanente Boosts sollen
          //       denselben Wert haben wie im Haupt‑TR -------------------------
          allBoosts
            .filter(b => b.type === 'boolean' && !b.permanent)
            .forEach(b => {
              const key             = b.key;
              const isMarked        = step.selectedForNextTR.includes(key);
              const hasExplicitBool = Object.prototype.hasOwnProperty.call(step.targetBools, key);

              if (!isMarked && !hasExplicitBool) {
                // ⇒ graues Kästchen: Wert aus dem Haupt‑TR übernehmen
                const prevBool = acc[key] || 0;    // Wert aus dem vorherigen Step
                step.stats[key] = prevBool;        // nicht aus dem Haupt‑TR!
              }
            });

          trSteps.push(step);

          // neue akkumulierte Stats
          acc = { ...step.stats };
          acc.trCount++;
          acc.allTimeOrbs += getStepOrbGains(step);
        });
      }
    }

    // Suchfeld zurücksetzen
    searchQuery.value = '';

    // Nachladen abhängiger Berechnungen
    nextTick(() => updateFollowingStepsStats(0));

    // NACH dem Laden den ursprünglichen Zustand erfassen
    nextTick(() => {
      captureOriginalState();
    });
  }
  catch (e) {
    console.error('initData Error:', e);
    error.value = `Initialization failed: ${e.message}`;
  }
}