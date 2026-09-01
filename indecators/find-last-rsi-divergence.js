const isAdvancedPeak = (prev, cur, next, type, tolerance = 10) => {
  if (prev === undefined || next === undefined) return false;

  // Для піків (Bearish) орієнтуємось на стелю 100
  // Для впадин (Bullish) орієнтуємось на підлогу 0
  const level = type === "peak" ? 100 : 0;
  
  const distPrev = Math.abs(prev - level);
  const distCur = Math.abs(cur - level);
  const distNext = Math.abs(next - level);

  // Перевірка на V-подібну форму (для 100 це перевернута V)
  const isVShape = (distPrev + distNext) / 2 > distCur;
  
  // Наскільки близько ми підійшли до екстремуму (0 або 100)
  const isClose = distCur <= tolerance; 
  
  // Чи був підхід чітким (поточна точка ближче до рівня, ніж попередня)
  const isSignificant = distCur < (distPrev * 0.99); 
  
  // Підтвердження відскоку (наступна точка далі від рівня, ніж поточна)
  const strongBounce = distNext > distCur;

  return isVShape && isClose && isSignificant && strongBounce;
};

/**
 * Знаходить всі дивергенції RSI, перевіряючи для кожного піку наступні 10 піків.
 */
function findAllRSIDivergences(
  rsiData,
  priceData,
  {
    rsiAmplitude = 2,     // Чутливість до локальних екстремумів
    rsiDiffMin = 3,      // Мінімальна різниця RSI для дивергенції
    priceDiffMin = 0.1    // Мінімальна різниця ціни
  } = {}
) {
  if (!Array.isArray(rsiData) || !Array.isArray(priceData) || rsiData.length < 20) {
    return { bearish: [], bullish: [] };
  }

  // 0️⃣ Швидка мапа для ціни
  const priceByTime = new Map();
  for (const c of priceData) {
    priceByTime.set(c.time, c);
  }

  // 1️⃣ Знаходимо абсолютно всі локальні піки та впадини
  const peaks = [];   // Для Bearish (максимуми)
  const troughs = []; // Для Bullish (мінімуми)

  for (let i = 1; i < rsiData.length - 1; i++) {
    const prev = rsiData[i - 1].value;
    const curr = rsiData[i].value;
    const next = rsiData[i + 1].value;

    // Локальний максимум (Peak)
    if (curr > prev && curr > next) {
      peaks.push({ ...rsiData[i], index: i });
    }
    // Локальний мінімум (Trough)
    if (curr < prev && curr < next) {
      troughs.push({ ...rsiData[i], index: i });
    }
  }

  const results = {
    bearish: [],
    bullish: []
  };

  // Хелпер для отримання ціни
  const getPricePoint = (rsiPoint, type) => {
    const candle = priceByTime.get(rsiPoint.time);
    if (!candle) return null;
    return {
      time: candle.time,
      value: type === "bearish" ? candle.high : candle.low,
      candle
    };
  };

  // 2️⃣ Пошук ВЕДМЕЖИХ дивергенцій (Bearish)
  // Для кожного піку i перевіряємо наступні 10 піків (j)
  for (let i = 0; i < peaks.length; i++) {
    const r1 = peaks[i];
    const p1 = getPricePoint(r1, "bearish");
    if (!p1) continue;

    const limit = Math.min(i + 16, peaks.length); // Наступні 10 піків
    for (let j = i + 1; j < limit; j++) {
      const r2 = peaks[j];
      const p2 = getPricePoint(r2, "bearish");
      if (!p2) continue;

      // Умова Bearish: Ціна робить Higher High (p2 > p1), а RSI — Lower High (r2 < r1)
      const rsiDiff = r1.value - r2.value;
      const priceDiff = p2.value - p1.value;

      if (rsiDiff >= rsiDiffMin && priceDiff >= priceDiffMin) {
        results.bearish.push({
          type: "bearish",
          rsiPoints: [r1, r2],
          pricePoints: [p1, p2]
        });
      }
    }
  }

  // 3️⃣ Пошук БИЧИХ дивергенцій (Bullish)
  // Для кожної впадини i перевіряємо наступні 10 впадин (j)
  for (let i = 0; i < troughs.length; i++) {
    const r1 = troughs[i];
    const p1 = getPricePoint(r1, "bullish");
    if (!p1) continue;

    const limit = Math.min(i + 16, troughs.length);
    for (let j = i + 1; j < limit; j++) {
      const r2 = troughs[j];
      const p2 = getPricePoint(r2, "bullish");
      if (!p2) continue;

      // Умова Bullish: Ціна робить Lower Low (p2 < p1), а RSI — Higher Low (r2 > r1)
      const rsiDiff = r2.value - r1.value;
      const priceDiff = p1.value - p2.value;

      if (rsiDiff >= rsiDiffMin && priceDiff >= priceDiffMin) {
        results.bullish.push({
          type: "bullish",
          rsiPoints: [r1, r2],
          pricePoints: [p1, p2]
        });
      }
    }
  }

  return results;
}

export function findDivergencesWithMarkers(rsiData, priceData, config = {}) {
  // 1. Отримуємо всі дивергенції за допомогою оновленої логіки (з advanced піками)
  const results = findAllRSIDivergences(rsiData, priceData, config);
  
  const markers = [];
  const uniqueDivergenceIndices = []; // Новий масив для індексів
  const processedTimes = new Set();
  const processedIndices = new Set(); // Для унікальності індексів

  // Допоміжна функція для обробки результатів
  const processDivs = (divArray, type) => {
    divArray.forEach(div => {
      const rsiEndPoint = div.rsiPoints[1]; // Точка RSI, де зафіксована див.
      const priceEndPoint = div.pricePoints[1];

      // Додаємо в масив унікальних індексів
      // Використовуємо rsiEndPoint.index, який ми зберегли при пошуку піків
      if (!processedIndices.has(rsiEndPoint.index)) {
        uniqueDivergenceIndices.push({
          type: type,
          index: rsiEndPoint.index
        });
        processedIndices.add(rsiEndPoint.index);
      }

      // Додаємо маркер для графіку
      if (!processedTimes.has(priceEndPoint.time)) {
        const isBear = type === "bearish";
        markers.push({
          time: priceEndPoint.time,
          position: isBear ? "aboveBar" : "belowBar",
          color: isBear ? "#FF5252" : "#00E676",
          shape: isBear ? "arrowDown" : "arrowUp",
          text: isBear ? "Bear Div" : "Bull Div",
          size: 2
        });
        processedTimes.add(priceEndPoint.time);
      }
    });
  };

  // Обробляємо обидва типи
  processDivs(results.bearish, "bearish");
  processDivs(results.bullish, "bullish");

  // Сортуємо маркери по часу для коректного відображення
  markers.sort((a, b) => a.time - b.time);

  return {
    divergences: results,        // Об'єкт з детальними точками {bearish: [], bullish: []}
    markers: markers,            // Масив для chartSeries.setMarkers()
    uniqueDivergenceIndices: uniqueDivergenceIndices // Ваш новий масив {type, index}
  };
}



// // rsiData: [{ time, value }]
// // priceData: [{ time, open, high, low, close, volume }]
// export function findLastRSIDivergence(
//   rsiData,
//   priceData,
//   {
//     rsiAmplitude = 2,     // чутливість до локальних піків/впадин RSI
//     rsiDiffMin = 2,       // мінімальна різниця між двома точками RSI
//     priceDiffMin = 0.1     // мінімальна різниця між точками ціни (можеш поставити напр. 0.1% від ціни)
//   } = {}
// ) {
//   if (
//     !Array.isArray(rsiData) ||
//     !Array.isArray(priceData) ||
//     rsiData.length < 10 ||
//     priceData.length < 10
//   ) {
//     return null;
//   }

//   // ----------------------------------------------------
//   // 0️⃣ Мапа time -> свічка (щоб швидко знаходити ціну по часу RSI)
//   // ----------------------------------------------------
//   const priceByTime = new Map();
//   for (const c of priceData) {
//     priceByTime.set(c.time, c);
//   }

//   // ----------------------------------------------------
//   // 1️⃣ Знаходимо локальні піки та впадини RSI
//   // ----------------------------------------------------
//   const peaks = [];
//   const troughs = [];

//   for (let i = 1; i < rsiData.length - 1; i++) {
//     const prev = rsiData[i - 1].value;
//     const curr = rsiData[i].value;
//     const next = rsiData[i + 1].value;

//     // Локальний максимум
//     if (curr > prev + rsiAmplitude && curr > next + rsiAmplitude) {
//       peaks.push(rsiData[i]);
//     }
//     // Локальний мінімум
//     if (curr < prev - rsiAmplitude && curr < next - rsiAmplitude) {
//       troughs.push(rsiData[i]);
//     }
//   }

//   if (peaks.length < 2 && troughs.length < 2) return null;

//   // Хелпер для отримання "точки ціни" по RSI-точці
//   const getPricePoint = (rsiPoint, type) => {
//     const candle = priceByTime.get(rsiPoint.time);
//     if (!candle) return null;

//     if (type === "bearish") {
//       // для ведмежої дивергенції логічно брати HIGHS
//       return {
//         time: candle.time,
//         value: candle.high,
//         candle,
//       };
//     } else {
//       // для бичої – LOWS
//       return {
//         time: candle.time,
//         value: candle.low,
//         candle,
//       };
//     }
//   };

//   // ----------------------------------------------------
//   // 2️⃣ ВЕДМЕЖА ДИВЕРГЕНЦІЯ (Bearish)
//   // RSI: lower high, Ціна: higher high
//   // ----------------------------------------------------
//   for (let i = peaks.length - 2; i >= 0; i--) {
//     const r1 = peaks[i];
//     const r2 = peaks[i + 1];
//     if (r2.time <= r1.time) continue;

//     // RSI робить lower high
//     const rsiDiff = r1.value - r2.value;
//     if (rsiDiff < rsiDiffMin) continue;

//     // Дістаємо відповідні точки ціни
//     const p1 = getPricePoint(r1, "bearish");
//     const p2 = getPricePoint(r2, "bearish");
//     if (!p1 || !p2) continue;

//     // Ціна робить higher high
//     const priceDiff = p2.value - p1.value;
//     if (priceDiff < priceDiffMin) continue;

//     return {
//       type: "bearish",
//       // для сумісності зі старим кодом
//       points: [r1, r2],           // RSI точки
//       rsiPoints: [r1, r2],
//       pricePoints: [p1, p2],      // точки на графіку ціни (по high)
//     };
//   }

//   // ----------------------------------------------------
//   // 3️⃣ БИЧА ДИВЕРГЕНЦІЯ (Bullish)
//   // RSI: higher low, Ціна: lower low
//   // ----------------------------------------------------
//   for (let i = troughs.length - 2; i >= 0; i--) {
//     const r1 = troughs[i];
//     const r2 = troughs[i + 1];
//     if (r2.time <= r1.time) continue;

//     // RSI робить higher low
//     const rsiDiff = r2.value - r1.value;
//     if (rsiDiff < rsiDiffMin) continue;

//     // Дістаємо відповідні точки ціни
//     const p1 = getPricePoint(r1, "bullish");
//     const p2 = getPricePoint(r2, "bullish");
//     if (!p1 || !p2) continue;

//     // Ціна робить lower low
//     const priceDiff = p1.value - p2.value;
//     if (priceDiff < priceDiffMin) continue;

//     return {
//       type: "bullish",
//       points: [r1, r2],           // RSI точки
//       rsiPoints: [r1, r2],
//       pricePoints: [p1, p2],      // точки на графіку ціни (по low)
//     };
//   }

//   return null;
// }


// export function findLastRSIDivergence(rsiData, rsiAmplitude = 5, priceAmplitude = 3) {
//   if (!Array.isArray(rsiData) || rsiData.length < 10) return null;

//   // ---------------------------
//   // 1️⃣ Знаходимо локальні піки та впадини RSI
//   // ---------------------------
//   const peaks = [];
//   const troughs = [];

//   for (let i = 1; i < rsiData.length - 1; i++) {
//     const prev = rsiData[i - 1].value;
//     const curr = rsiData[i].value;
//     const next = rsiData[i + 1].value;

//     // Локальний максимум
//     if (curr > prev + rsiAmplitude && curr > next + rsiAmplitude) {
//       peaks.push(rsiData[i]);
//     }
//     // Локальний мінімум
//     if (curr < prev - rsiAmplitude && curr < next - rsiAmplitude) {
//       troughs.push(rsiData[i]);
//     }
//   }

//   if (peaks.length < 2 && troughs.length < 2) return null;

//   // ---------------------------
//   // 2️⃣ ВЕДМЕЖА ДИВЕРГЕНЦІЯ (Bearish)
//   // RSI ↓ між двома піками
//   // ---------------------------
//   for (let i = peaks.length - 2; i >= 0; i--) {
//     const p1 = peaks[i];
//     const p2 = peaks[i + 1];

//     const diff = p1.value - p2.value;

//     // Якщо RSI реально впав і падіння достатньо велике
//     if (diff >= priceAmplitude && p2.time > p1.time) {
//       return {
//         type: "bearish",
//         points: [p1, p2],
//       };
//     }
//   }

//   // ---------------------------
//   // 3️⃣ БИЧА ДИВЕРГЕНЦІЯ (Bullish)
//   // RSI ↑ між двома впадинами
//   // ---------------------------
//   for (let i = troughs.length - 2; i >= 0; i--) {
//     const t1 = troughs[i];
//     const t2 = troughs[i + 1];

//     const diff = t2.value - t1.value;

//     if (diff >= priceAmplitude && t2.time > t1.time) {
//       return {
//         type: "bullish",
//         points: [t1, t2],
//       };
//     }
//   }

//   return null;
// }