import { computed } from 'vue';
import Decimal from 'break_infinity.js';
import { mechs, getMechByKey } from '@/constants/mech-planner/index.js';
import { useMechPlannerStore } from '@/store/mechPlannerStore.js';
import { useGemPlannerStore } from '@/store/gemPlannerStore.js';
import { useRelicPlannerStore } from '@/store/relicPlannerStore.js';
import { useGadgetPlannerStore } from '@/store/gadgetPlannerStore.js';

export function useMechOutputStats() {
  const mechPlannerStore = useMechPlannerStore();
  const gemPlannerStore = useGemPlannerStore();
  const relicPlannerStore = useRelicPlannerStore();
  const gadgetPlannerStore = useGadgetPlannerStore();

  // --- Reactive store accessors ---

  const mechSettings = computed(() => mechPlannerStore.mechSettings);

  const coorsRelic = computed(() => relicPlannerStore.currentLevels['r8'] || 0);

  const tulsandstofKit = computed(() => relicPlannerStore.currentLevels['r15'] || 0);

  const mechEngineerToolPants = computed(() => gadgetPlannerStore.currentLevels['g13'] || 0);

  const transmissionAmplifierTier = computed(() => mechPlannerStore.transmissionAmplifierTier);

  const transmissionAmplifierLevel = computed(() => mechPlannerStore.transmissionAmplifierLevel);

  const creationGemLevel = computed(() => {
    const creationGem = gemPlannerStore.getGemState('creation');
    return creationGem?.level || 0;
  });

  const creationGemNode1 = computed(() => {
    const creationGem = gemPlannerStore.getGemState('creation');
    return creationGem?.nodes?.[0] || false;
  });

  const creationGemNode2 = computed(() => {
    const creationGem = gemPlannerStore.getGemState('creation');
    return creationGem?.nodes?.[1] || false;
  });

  const creationMechBonusCap = computed(() => {
    const creationGem = gemPlannerStore.getGemState('creation');
    return creationGem?.upgrades?.['mech-bonus-cap'] || 0;
  });

  const exodusGemNode5 = computed(() => {
    const exodusGem = gemPlannerStore.getGemState('exodus');
    return exodusGem?.nodes?.[4] || false;
  });

  // --- Calculation functions ---

  const getCurrentMultiplier = (mechKey) => {
    const mech = mechs.find(m => m.key === mechKey);
    const settings = mechSettings.value[mechKey];

    if (!mech || !settings || settings.owned === 0) {
      return new Decimal(0);
    }

    // Token Unit special handling
    if (mech.key === 'token_mk1') {
      return new Decimal(mech.multiIncrease || 10000).mul(settings.multiUpgrades || 1);
    }

    const baseValue = new Decimal(1);
    const multiIncreaseValue = new Decimal(mech.multiIncrease || 0);
    const baseMultiValue = new Decimal(mech.baseMulti || 0);

    const multiIncreaseBonus = multiIncreaseValue.mul(settings.multiUpgrades || 0);
    const mechsBonus = multiIncreaseBonus.mul(settings.owned || 0);

    return baseValue.add(mechsBonus).add(baseMultiValue);
  };

  const getCurrentTimer = (mechKey) => {
    const mech = mechs.find(m => m.key === mechKey);
    const settings = mechSettings.value[mechKey];

    if (!mech || !settings) return mech?.timeStart || 0;

    let currentTime = mech.timeStart;
    currentTime -= settings.timeUpgrades * mech.timeReduce;

    if (creationGemNode1.value) {
      currentTime -= 1800;
    }

    return Math.max(10, currentTime);
  };

  const getMaxCapacity = (mechKey) => {
    const mech = mechs.find(m => m.key === mechKey);

    if (mech?.key === 'token_mk1') {
      return new Decimal(0);
    }

    const settings = mechSettings.value[mechKey];
    if (!mech || !settings) return new Decimal(0);

    let capacity = new Decimal(mech.baseCap);

    // COORS bonus: 1e5 per level
    if (coorsRelic.value > 0) {
      const coorsBonus = new Decimal(10).pow(5 * coorsRelic.value);
      capacity = capacity.mul(coorsBonus);
    }

    // Creation Gem Level und Mech Bonus Cap
    if (creationGemLevel.value > 0 || creationMechBonusCap.value > 0) {
      const base = new Decimal(100000000);
      const exponent1 = creationMechBonusCap.value;
      const exponent2 = 1 + (creationGemLevel.value * 0.1) - 0.1;
      const firstPow = base.pow(exponent1);
      const gemBonusCapFormula = firstPow.pow(exponent2);
      capacity = capacity.mul(gemBonusCapFormula);
    }

    // Creation Gem Node #2 bonus
    if (mech.creagn2 && creationGemNode2.value) {
      capacity = capacity.mul(new Decimal(10).pow(1000));
    }

    // Mech Engineer Tool-Pants bonus
    if (mechEngineerToolPants.value > 0) {
      const toolPantsBonus1 = new Decimal(1.4).pow(mechEngineerToolPants.value);
      const toolPantsBonus2 = new Decimal(10).pow(Math.floor(mechEngineerToolPants.value / 10));
      capacity = capacity.mul(toolPantsBonus1.mul(toolPantsBonus2));
    }

    // Transmission Amplifier bonus
    if (transmissionAmplifierLevel.value > 0) {
      const baseExponent = 3 + transmissionAmplifierTier.value;
      const amplifierBonus = new Decimal(10).pow(baseExponent * transmissionAmplifierLevel.value);
      capacity = capacity.mul(amplifierBonus);
    }

    // Exodus Gem Node #5 bonus
    if (exodusGemNode5.value) {
      capacity = capacity.mul(new Decimal("1e140"));
    }

    return capacity;
  };

  // Token Unit helpers
  const getTokensPerCycle = (mechKey) => {
    const mech = mechs.find(m => m.key === mechKey);
    const settings = mechSettings.value[mechKey];

    if (!mech || !settings || mech.key !== 'token_mk1') {
      return new Decimal(0);
    }

    return new Decimal(mech.multiIncrease || 10000)
      .mul(settings.multiUpgrades || 1)
      .mul(settings.owned || 1);
  };

  const getCyclesPerDay = (mechKey) => {
    const currentTimer = getCurrentTimer(mechKey);
    if (currentTimer === 0) return new Decimal(0);
    return new Decimal(86400 / currentTimer);
  };

  const getTokensPerDay = (mechKey) => {
    const mech = mechs.find(m => m.key === mechKey);
    if (!mech || mech.key !== 'token_mk1') return new Decimal(0);
    return getTokensPerCycle(mechKey).mul(getCyclesPerDay(mechKey));
  };

  const getTokensPerWeek = (mechKey) => {
    return getTokensPerDay(mechKey).mul(7);
  };

  const getOutputPerDay = (mechKey) => {
    const mech = mechs.find(m => m.key === mechKey);

    if (mech?.key === 'token_mk1') {
      return getTokensPerDay(mechKey);
    }

    const currentMulti = getCurrentMultiplier(mechKey);
    const currentTimer = getCurrentTimer(mechKey);

    if (currentMulti.eq(0) || currentTimer === 0) {
      return new Decimal(0);
    }

    const timerInDays = currentTimer / 86400;
    return currentMulti.pow(1 / timerInDays);
  };

  const getOutputPerWeek = (mechKey) => {
    const mech = mechs.find(m => m.key === mechKey);

    if (mech?.key === 'token_mk1') {
      return getTokensPerWeek(mechKey);
    }

    return getOutputPerDay(mechKey).pow(7);
  };

  const getCurrentOutputMultiplierDecimal = (mechKey) => {
    const value = mechPlannerStore.currentOutputMultiplier[mechKey] || new Decimal(1);
    return value.lt(1) ? new Decimal(1) : value;
  };

  const getTimeToCap = (mechKey) => {
    const currentOutput = getCurrentOutputMultiplierDecimal(mechKey);
    const maxCapacity = getMaxCapacity(mechKey);
    const currentMulti = getCurrentMultiplier(mechKey);
    const currentTimer = getCurrentTimer(mechKey);

    if (currentOutput.gte(maxCapacity) || currentMulti.eq(0) || currentOutput.eq(0)) {
      return null;
    }

    if (currentMulti.lte(1)) {
      return null;
    }

    try {
      const currentExpInput = mechPlannerStore.currentOutputMultiplierInput[mechKey] || '1';
      let currentExp = 0;

      if (currentExpInput.includes('e')) {
        const parts = currentExpInput.split('e');
        const base = parseFloat(parts[0]);
        const exp = parseInt(parts[1]);
        currentExp = exp + Math.log10(base);
      } else {
        const numVal = parseFloat(currentExpInput);
        currentExp = numVal > 0 ? Math.log10(numVal) : 0;
      }

      const maxCapStr = maxCapacity.toString();
      let maxCapacityExp;
      if (maxCapStr.includes('e+')) {
        const parts = maxCapStr.split('e+');
        maxCapacityExp = parseInt(parts[1]) + Math.log10(parseFloat(parts[0]));
      } else if (maxCapStr.includes('e')) {
        const parts = maxCapStr.split('e');
        maxCapacityExp = parseInt(parts[1]) + Math.log10(parseFloat(parts[0]));
      } else {
        maxCapacityExp = Math.log10(parseFloat(maxCapStr));
      }

      const multiLog = Math.log10(currentMulti.toNumber());
      if (multiLog <= 0) return null;

      const expDifference = maxCapacityExp - currentExp;
      const cycles = expDifference / multiLog;

      if (!isFinite(cycles) || cycles <= 0 || isNaN(cycles)) return null;

      const timeInSeconds = cycles * currentTimer;
      if (!isFinite(timeInSeconds)) return null;

      return timeInSeconds;
    } catch {
      return null;
    }
  };

  // --- Format helpers ---

  const formatOutputStatistic = (value) => {
    if (!(value instanceof Decimal)) return '0';
    if (value.eq(0)) return '0';

    if (value.lt(1000)) {
      const numValue = value.toNumber();
      if (numValue >= 100) return numValue.toFixed(0);
      if (numValue >= 10) return numValue.toFixed(1);
      if (numValue >= 1) return numValue.toFixed(2);
      return numValue.toFixed(3);
    }

    return value.toExponential(2).replace('e+', 'e');
  };

  const formatDuration = (totalSeconds) => {
    if (!isFinite(totalSeconds) || isNaN(totalSeconds) || totalSeconds <= 0) return '—';

    const SECONDS_PER_MINUTE = 60;
    const SECONDS_PER_HOUR = 3600;
    const SECONDS_PER_DAY = 86400;
    const SECONDS_PER_YEAR = 31536000;

    if (totalSeconds >= SECONDS_PER_YEAR * 100) {
      return `${Math.round(totalSeconds / SECONDS_PER_YEAR)} years`;
    }

    const years = Math.floor(totalSeconds / SECONDS_PER_YEAR);
    const remainingAfterYears = totalSeconds % SECONDS_PER_YEAR;
    const days = Math.floor(remainingAfterYears / SECONDS_PER_DAY);
    const remainingAfterDays = remainingAfterYears % SECONDS_PER_DAY;
    const hours = Math.floor(remainingAfterDays / SECONDS_PER_HOUR);
    const minutes = Math.round((remainingAfterDays % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

    const parts = [];
    if (years > 0) {
      parts.push(`${years}y`);
      if (days > 0) parts.push(`${days}d`);
    } else if (days > 0) {
      parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
    } else if (hours > 0) {
      parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
    } else {
      parts.push(`${Math.max(1, minutes)}m`);
    }

    return parts.join(' ');
  };

  const getTimeToCapFormatted = (mechKey) => {
    const seconds = getTimeToCap(mechKey);
    if (seconds === null) return null;
    return formatDuration(seconds);
  };

  return {
    // Core calculations
    getCurrentMultiplier,
    getCurrentTimer,
    getMaxCapacity,
    getOutputPerDay,
    getOutputPerWeek,
    getCurrentOutputMultiplierDecimal,
    getTimeToCap,
    getTimeToCapFormatted,

    // Token helpers
    getTokensPerCycle,
    getCyclesPerDay,
    getTokensPerDay,
    getTokensPerWeek,

    // Formatting
    formatOutputStatistic,
    formatDuration,

    // Reactive store accessors (for external use)
    mechSettings,
    exodusGemNode5,
  };
}
