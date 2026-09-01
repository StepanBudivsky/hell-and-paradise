export function findHammersSeries(candles, confirmBars = 2, opts = {}) {
  const {
    swingConfirm = 0,             // 0 = без swing, 1..N = локальний мінімум
    extendBars = 0,
    color = '#ff55ffff',          // рожевий
    untilBreak = false,
    breakPad = 0,

    // confirmBars = 2,              // скільки наступних свічок мають підтвердити
    confirmMode = 'closeAboveHigh',         // 'bull' | 'closeAboveHigh' (підтвердження)

    minShadowRatio = 1.5,           // довга тінь >= body * ratio
    maxOtherShadowToBody = 0.6,   // коротка тінь <= body * ratio
    maxBodyToRange = 0.5,         // body <= 40% діапазону
    allowBearBody = true,         // дозволити червоне тіло в молоті
    levelMode = 'low',            // 'low' | 'high' (де малювати лінію)
  } = opts;

  if (!Array.isArray(candles) || candles.length === 0) return [];

  const series = candles.map(c => ({
    time: c.time,
    value: c.close,
    color: 'transparent',
  }));

  const n = candles.length;

  const isBull = c => c.close > c.open;
  const isBear = c => c.close < c.open;

  const isLocalMin = (idx, look = 1) => {
    const l = candles[idx].low;
    for (let k = 1; k <= look; k++) {
      if (idx - k >= 0 && candles[idx - k].low < l) return false;
      if (idx + k < n && candles[idx + k].low < l) return false;
    }
    return true;
  };

  const candleParts = c => {
    const body = Math.abs(c.close - c.open);
    const range = c.high - c.low;
    const upperShadow = c.high - Math.max(c.close, c.open);
    const lowerShadow = Math.min(c.close, c.open) - c.low;
    return { body, range, upperShadow, lowerShadow };
  };

  // type: 'hammer' | 'inverted'
  const classifyHammer = c => {
    const { body, range, upperShadow, lowerShadow } = candleParts(c);

    if (range <= 0 || body <= 0) return null;
    if (body / range > maxBodyToRange) return null;

    if (!allowBearBody && isBear(c)) return null;

    const isHammer =
      lowerShadow >= body * minShadowRatio &&
      upperShadow <= body * maxOtherShadowToBody;

    const isInvertedHammer =
      upperShadow >= body * minShadowRatio &&
      lowerShadow <= body * maxOtherShadowToBody;

    if (isHammer) return 'hammer';
    if (isInvertedHammer) return 'inverted';
    return null;
  };

  const passesConfirmation = (idx) => {
    if (confirmBars <= 0) return true;

    const lastNeededIdx = idx + confirmBars;

    // ✅ кінець графіка: ще нема всіх confirmBars -> показуємо тимчасово
    if (lastNeededIdx >= n) return true;

    // є достатньо свічок для перевірки
    if (confirmMode === 'closeAboveHigh') {
      const pivotHigh = candles[idx].high;
      for (let k = 1; k <= confirmBars; k++) {
        if (!(candles[idx + k].close > pivotHigh)) return false;
      }
      return true;
    }

    // confirmMode === 'bull'
    for (let k = 1; k <= confirmBars; k++) {
      if (!isBull(candles[idx + k])) return false;
    }
    return true;
  };

  const paintLevel = (startIdx, endIdx, level) => {
    for (let i = startIdx; i <= endIdx; i++) {
      series[i].value = level;
      series[i].color = color;
    }

    if (untilBreak) {
      for (let j = endIdx + 1; j < n; j++) {
        const c = candles[j];
        const broken = levelMode === 'low'
          ? (c.close < level - breakPad)
          : (c.close > level + breakPad);
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

  for (let i = 0; i < n; i++) {
    const c = candles[i];

    const type = classifyHammer(c);
    if (!type) continue;

    // обидва (hammer і inverted) зазвичай шукають внизу руху → локальний мінімум
    if (swingConfirm > 0 && !isLocalMin(i, swingConfirm)) continue;

    if (!passesConfirmation(i)) continue;

    // де малювати рівень (часто підтримка = low)
    const level = (levelMode === 'high') ? c.high : c.low;

    // малюємо на самому барі молота
    paintLevel(i, i, level);
  }

  return series;
}

// export function findHammersSeries(candles, opts = {}) {
//   const {
//     swingConfirm = 1,        // перевірка, що це локальний мінімум (0 = вимкнути)
//     extendBars = 0,
//     color = '#ff55ffff',     // рожевий колір лінії
//     untilBreak = false,
//     breakPad = 0,
//     confirmBars = 2,         // скільки свічок після молота мають піти вгору
//     minShadowRatio = 2,      // нижня тінь >= 2 * тіло
//     maxUpperShadowToBody = 0.3, // верхня тінь <= 0.3 * тіло
//     maxBodyToRange = 0.4,    // тіло <= 40% від всього діапазону
//   } = opts;

//   if (!Array.isArray(candles) || candles.length === 0) return [];

//   const series = candles.map(c => ({
//     time: c.time,
//     value: c.close,
//     color: 'transparent',
//   }));

//   const n = candles.length;

//   const isBull = c => c.close > c.open;
//   const isBear = c => c.close < c.open;

//   const isLocalMin = (idx, look = 1) => {
//     const l = candles[idx].low;
//     for (let k = 1; k <= look; k++) {
//       if (idx - k >= 0 && candles[idx - k].low < l) return false;
//       if (idx + k < n && candles[idx + k].low < l) return false;
//     }
//     return true;
//   };

//   // Перевірка, що свічка є молотом (без перевернутого)
//   const isHammer = c => {
//     const body = Math.abs(c.close - c.open);
//     const range = c.high - c.low;

//     if (range === 0) return false;
//     if (body === 0) return false;

//     const upperShadow = c.high - Math.max(c.close, c.open);
//     const lowerShadow = Math.min(c.close, c.open) - c.low;

//     // тіло не надто велике відносно всього діапазону
//     if (body / range > maxBodyToRange) return false;

//     // нижня тінь суттєво більша за тіло
//     if (lowerShadow < body * minShadowRatio) return false;

//     // верхня тінь маленька (щоб не перетворився в дожі/перевернутий)
//     if (upperShadow > body * maxUpperShadowToBody) return false;

//     // класично молот — краще, коли закривається вище відкриття (але можна дозволити й медвежу)
//     // якщо хочеш дозволити будь-який колір тіла — закоментуй наступний рядок
//     if (!isBull(c)) return false;

//     return true;
//   };

//   const paintLevel = (startIdx, endIdx, level) => {
//     // ставимо рівень по low молота
//     for (let i = startIdx; i <= endIdx; i++) {
//       series[i].value = level;
//       series[i].color = color;
//     }

//     if (untilBreak) {
//       // тягнемо лінію, поки не проб’ємо вниз
//       for (let j = endIdx + 1; j < n; j++) {
//         const c = candles[j];
//         const broken = c.close < level - breakPad;
//         if (broken) break;
//         series[j].value = level;
//         series[j].color = color;
//       }
//     } else if (extendBars > 0) {
//       for (let k = 1; k <= extendBars && endIdx + k < n; k++) {
//         const j = endIdx + k;
//         series[j].value = level;
//         series[j].color = color;
//       }
//     }
//   };

//   for (let i = 0; i < n; i++) {
//     const c = candles[i];

//     // 1) Геометрія молота + (опційно) локальний мінімум
//     if (!isHammer(c)) continue;
//     if (swingConfirm > 0 && !isLocalMin(i, swingConfirm)) continue;

//     // 2) Перевірка наступних confirmBars свічок
//     let confirmed = true;

//     if (confirmBars > 0) {
//       const lastNeededIdx = i + confirmBars;

//       if (lastNeededIdx < n) {
//         // є достатньо свічок для реальної перевірки
//         for (let k = 1; k <= confirmBars; k++) {
//           const idx = i + k;
//           // очікуємо бичі свічки, що підтверджують розворот вгору
//           if (!isBull(candles[idx])) {
//             confirmed = false;
//             break;
//           }
//         }
//       } else {
//         // ми в самому кінці, ще немає всіх confirmBars → тимчасово показуємо молот
//         confirmed = true;
//       }
//     }

//     if (!confirmed) continue;

//     const level = c.low;
//     paintLevel(i, i, level); // малюємо тільки на одному барі (молоті)
//   }

//   return series;
// }