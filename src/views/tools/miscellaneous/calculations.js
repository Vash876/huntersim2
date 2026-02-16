/**
 * Shared calculation helpers for Miscellaneous widgets.
 */

/**
 * Calculate how many levels you can buy and the resulting buff.
 *
 * Given X OOMs of RP (relative to current level cost),
 * each level costs costMult times the previous one.
 * You buy levels until the cost exceeds your RP.
 *
 * costMult^N ≤ 10^X  →  N = floor(X / log₁₀(costMult))
 */
export function calculateUltima(oomInput, costMult, buffMult, tickSpeed) {
  if (oomInput === null || oomInput === undefined || oomInput < 0) return null;
  const x = oomInput;
  if (x === 0) return { levels: 0, buffDisplay: '×1', timeDisplay: '0s' };

  const log10CostMult = Math.log10(costMult);
  const levels = Math.floor(x / log10CostMult);

  if (levels <= 0) return { levels: 0, buffDisplay: '×1', timeDisplay: '0s' };

  // Buff = buffMult^levels — express in OOMs
  const buffOomsRaw = levels * Math.log10(buffMult);

  // Display buff in proper scientific notation
  let buffDisplay;
  if (buffOomsRaw < 3) {
    const actualBuff = Math.pow(10, buffOomsRaw);
    buffDisplay = '×' + actualBuff.toFixed(2);
  } else {
    const exponent = Math.floor(buffOomsRaw);
    const mantissa = Math.pow(10, buffOomsRaw - exponent);
    buffDisplay = '×' + mantissa.toFixed(2) + 'e' + exponent;
  }

  // Time = levels * tickSpeed (1 level per tick)
  const timeDisplay = formatDuration(levels * tickSpeed);

  return { levels, buffDisplay, timeDisplay };
}

/**
 * Format seconds into human-readable duration string.
 */
export function formatDuration(totalSeconds) {
  if (totalSeconds < 60) {
    return `${Math.round(totalSeconds)}s`;
  } else if (totalSeconds < 3600) {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.round(totalSeconds % 60);
    return `${m}m ${s}s`;
  } else if (totalSeconds < 86400) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  } else {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    return `${d}d ${h}h`;
  }
}

/**
 * Format a large multiplier value for display.
 */
export function formatMultiplier(val) {
  if (val < 100) return '×' + val.toFixed(2);
  if (val < 1e3) return '×' + val.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const exp = Math.floor(Math.log10(val));
  const mant = val / Math.pow(10, exp);
  return '×' + mant.toFixed(2) + 'e' + exp;
}
