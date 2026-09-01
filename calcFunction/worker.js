// calcFunction/worker.js
import { calculateMACD } from "../indecators/ema-macd-rsi-ma-indecator.js";
import { findMacdSegments } from "../indecators/find-macd-segments.js";
import { extractColoredMarkers } from "../indecators/find-min-max-dots.js";
// import { analyzeMACD } from "../analyze/analyze-macd.js";

self.onmessage = function(e) {
  const { klines, settings } = e.data;

  // 1. Рахуємо сам MACD
  const macd = calculateMACD(klines);

  // 2. Шукаємо сегменти (дивергенції)
  const macdSegment = findMacdSegments(
    macd.histogram,
    settings.promFactor,
    settings.minSegLen,
    settings.minDistance
  );

  // 3. Отримуємо маркери (точки)
  const markersMinMax = extractColoredMarkers(macdSegment, settings.currentMacdRegim);

  // 4. Аналізуємо (якщо analyzeMACD повертає якісь дані для UI, додайте їх в return)
  // analyzeMACD(macd.histogram, macdSegment);

  // Відправляємо все назад
  self.postMessage({
    macd,
    macdSegment,
    markersMinMax
  });
};