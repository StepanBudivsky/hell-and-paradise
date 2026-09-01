export function findEngulfingSeries(candles, opts = {}) {
  const {
    relTol = 0.00002,
    absTol = 0,

    swingConfirm = 1,
    extendBars = 0,
    color = '#ffaa00ff',

    untilBreak = false,
    breakPad = 0,

    confirmBars = 2,
    confirmMode = 'direction', // 'direction' | 'closeBeyondLevel'

    // engulfing
    strictOpposite = true,
    allowDojiFirst = true,
    minBody = 0,
    engulfMode = 'body', // ✅ 'body' | 'full'

    levelMode = 'mid',
  } = opts;

  if (!Array.isArray(candles) || candles.length === 0) return { series: [], signals: [] };

  const series = candles.map(c => ({
    time: c.time,
    value: c.close,
    color: 'transparent',
  }));

  // Створюємо масив для збереження знайдених сигналів
  const signals = [];

  const n = candles.length;

  const tolVal = (a, b, pRef) =>
    Math.max(absTol, (pRef ?? Math.max(Math.abs(a), Math.abs(b), 1)) * relTol);

  const almostLE = (a, b, pRef) => a <= b + tolVal(a, b, pRef);
  const almostGE = (a, b, pRef) => a + tolVal(a, b, pRef) >= b;

  const isBull = c => c.close > c.open;
  const isBear = c => c.close < c.open;

  const bodySize = c => Math.abs(c.close - c.open);
  const bodyTop = c => Math.max(c.open, c.close);
  const bodyBot = c => Math.min(c.open, c.close);

  const isLocalMax = (idx, look = 1) => {
    const h = candles[idx].high;
    for (let k = 1; k <= look; k++) {
      if (idx - k >= 0 && candles[idx - k].high > h) return false;
      if (idx + k < n && candles[idx + k].high > h) return false;
    }
    return true;
  };

  const isLocalMin = (idx, look = 1) => {
    const l = candles[idx].low;
    for (let k = 1; k <= look; k++) {
      if (idx - k >= 0 && candles[idx - k].low < l) return false;
      if (idx + k < n && candles[idx + k].low < l) return false;
    }
    return true;
  };

  const getEngulfBounds = c => {
    if (engulfMode === 'full') {
      return { top: c.high, bot: c.low };
    }
    return { top: bodyTop(c), bot: bodyBot(c) };
  };

  const calcLevel = (a, b) => {
    if (levelMode === 'high') return Math.max(a.high, b.high);
    if (levelMode === 'low') return Math.min(a.low, b.low);
    if (levelMode === 'open2') return b.open;
    if (levelMode === 'close2') return b.close;
    if (levelMode === 'bodyMid2') return (bodyTop(b) + bodyBot(b)) / 2;
    return (Math.min(a.low, b.low) + Math.max(a.high, b.high)) / 2;
  };

  const passesConfirmation = (idx2, isBullish, level) => {
    if (confirmBars <= 0) return true;

    const lastIdx = idx2 + confirmBars;
    if (lastIdx >= n) return true; // кінець графіка

    if (confirmMode === 'closeBeyondLevel') {
      for (let k = 1; k <= confirmBars; k++) {
        const c = candles[idx2 + k];
        if (isBullish && c.close <= level) return false;
        if (!isBullish && c.close >= level) return false;
      }
      return true;
    }

    for (let k = 1; k <= confirmBars; k++) {
      const c = candles[idx2 + k];
      if (isBullish && !isBull(c)) return false;
      if (!isBullish && !isBear(c)) return false;
    }
    return true;
  };

  const paintLevel = (startIdx, endIdx, level, isTopBreakRule) => {
    for (let i = startIdx; i <= endIdx; i++) {
      series[i].value = level;
      series[i].color = color;
    }

    if (untilBreak) {
      for (let j = endIdx + 1; j < n; j++) {
        const c = candles[j];
        const broken = isTopBreakRule
          ? c.close > level + breakPad
          : c.close < level - breakPad;
        if (broken) break;
        series[j].value = level;
        series[j].color = color;
      }
    } else if (extendBars > 0) {
      for (let k = 1; k <= extendBars && endIdx + k < n; k++) {
        const j = endIdx + k;
        series[j].value = level;
        series[j].color = color;
      }
    }
  };

  for (let i = 0; i < n - 1; i++) {
    const a = candles[i];
    const b = candles[i + 1];

    if (bodySize(a) < minBody || bodySize(b) < minBody) continue;

    const aBull = isBull(a);
    const aBear = isBear(a);
    const bBull = isBull(b);
    const bBear = isBear(b);

    if (!allowDojiFirst && !(aBull || aBear)) continue;

    const A = getEngulfBounds(a);
    const B = getEngulfBounds(b);

    // ===== Bullish engulfing =====
    if ((strictOpposite ? aBear && bBull : bBull)) {
      const engulf =
        almostLE(B.bot, A.bot) &&
        almostGE(B.top, A.top);

      if (engulf && (swingConfirm === 0 || isLocalMin(i, swingConfirm) || isLocalMin(i + 1, swingConfirm))) {
        const level = calcLevel(a, b);
        if (passesConfirmation(i + 1, true, level)) {
          paintLevel(i, i + 1, level, true);
          // Додаємо індекс та тип у список сигналів
          signals.push({ index: i + 1, type: 'Поглинання знизу', time: candles[i + 1].time });
          continue;
        }
      }
    }

    // ===== Bearish engulfing =====
    if ((strictOpposite ? aBull && bBear : bBear)) {
      const engulf =
        almostLE(B.bot, A.bot) &&
        almostGE(B.top, A.top);

      if (engulf && (swingConfirm === 0 || isLocalMax(i, swingConfirm) || isLocalMax(i + 1, swingConfirm))) {
        const level = calcLevel(a, b);
        if (passesConfirmation(i + 1, false, level)) {
          paintLevel(i, i + 1, level, false);
          // Додаємо індекс та тип у список сигналів
          signals.push({ index: i + 1, type: 'Поглинання зверху', time: candles[i + 1].time});
          continue;
        }
      }
    }
  }

  // Повертаємо і графік, і список сигналів
  return { series, signals };
}