export function findTweezersSeries(candles, confirmBars = 2, opts = {}) { // скільки свічок мають підтвердити напрямок
  const {
    relTol = 0.00002,
    absTol = 0,
    swingConfirm = 1,
    extendBars = 0,
    color = '#00ff55ff',
    untilBreak = false,
    breakPad = 0,
    
  } = opts;

  // Повертаємо об'єкт з порожніми масивами, якщо даних немає
  if (!Array.isArray(candles) || candles.length === 0) return { series: [], signals: [] };

  const series = candles.map(c => ({
    time: c.time,
    value: c.close,
    color: 'transparent',
  }));

  // Масив для збереження сигналів пінцета
  const signals = [];

  const n = candles.length;

  const almostEqual = (a, b, pRef) => {
    const tol = Math.max(
      absTol,
      (pRef ?? Math.max(Math.abs(a), Math.abs(b), 1)) * relTol
    );
    return Math.abs(a - b) <= tol;
  };

  const isBear = c => c.close < c.open;
  const isBull = c => c.close > c.open;
  const notBear = c => c.close >= c.open;
  const notBull = c => c.close <= c.open;

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

  const paintLevel = (startIdx, endIdx, level, isTop) => {
    // малюємо на двох барах патерну
    for (let i = startIdx; i <= endIdx; i++) {
      series[i].value = level;
      series[i].color = color;
    }

    if (untilBreak) {
      for (let j = endIdx + 1; j < n; j++) {
        const c = candles[j];
        const broken = isTop
          ? (c.close > level + breakPad)
          : (c.close < level - breakPad);
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

    // ---------------- Tweezer Top ----------------
    if (
      almostEqual(a.high, b.high) &&
      notBear(a) && isBear(b) &&
      (swingConfirm === 0 ||
        isLocalMax(i, swingConfirm) ||
        isLocalMax(i + 1, swingConfirm))
    ) {
      let confirmed = true;

      if (confirmBars > 0) {
        const lastNeededIdx = i + 1 + confirmBars;

        if (lastNeededIdx < n) {
          // є достатньо свічок для реальної перевірки
          for (let k = 1; k <= confirmBars; k++) {
            const idx = i + 1 + k; // свічки після другої
            if (!isBear(candles[idx])) {
              confirmed = false;
              break;
            }
          }
        } else {
          // ми в самому кінці, ще не вистачає свічок → тимчасово вважаємо підтвердженим
          confirmed = true;
        }
      }

      if (!confirmed) continue;

      const level = (a.high + b.high) / 2;
      paintLevel(i, i + 1, level, /*isTop=*/true);
      // Додаємо сигнал вершини
      signals.push({ index: i + 1, type: 'Пінцет зверху', time: candles[i + 1].time });
      continue;
    }

    // ---------------- Tweezer Bottom ----------------
    if (
      almostEqual(a.low, b.low) &&
      notBull(a) && isBull(b) &&
      (swingConfirm === 0 ||
        isLocalMin(i, swingConfirm) ||
        isLocalMin(i + 1, swingConfirm))
    ) {
      let confirmed = true;

      if (confirmBars > 0) {
        const lastNeededIdx = i + 1 + confirmBars;

        if (lastNeededIdx < n) {
          // є достатньо свічок для реальної перевірки
          for (let k = 1; k <= confirmBars; k++) {
            const idx = i + 1 + k;
            if (!isBull(candles[idx])) {
              confirmed = false;
              break;
            }
          }
        } else {
          // кінець графіка → показуємо тимчасово
          confirmed = true;
        }
      }

      if (!confirmed) continue;

      const level = (a.low + b.low) / 2;
      paintLevel(i, i + 1, level, /*isTop=*/false);
      // Додаємо сигнал основи
      signals.push({ index: i + 1, type: 'Пінцет знизу', time: candles[i + 1].time });
      continue;
    }
  }

  // Повертаємо результат
  return { series, signals };
}