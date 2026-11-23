// Покласти поруч із файлом, де лежить setChartInterval (тоді відносні шляхи нижче збігаються з вашими)
// і ОБОВ'ЯЗКОВО підключити десь при старті, наприклад у main.js:
//   import "./multi-interval-backtest.js";
import { getChartSettings } from "./core/pipeline/chart-get-settings.js";
import { chartProcessor } from "./core/pipeline/chart-processor.js";
import { analyzeDataByInterval } from "./settingsData/program-analyze-data.js";
import { currentInterval, klines, klinesData, mode, setKlines } from "./chart-data.js";
import { createScenariosMarker } from "./ui/panels/global-analytics-panel/create-scenarios-marker.js";
import {
  backtestMarkers,
  backtestMarkersHoldBars,
  compareWithRandomEntry,
  getConfigFromUI,
  getRandomOptionsFromUI,
  renderResultsToUI,
} from "./core/backtest/backtest-markers.js";

const MULTI_INTERVALS = ['1m', '5m', '15m', '30m', '1h'];

// Для ПОТОЧНОГО інтервалу getChartSettings обрізає klines до ліміту (klines = data.slice(0, ліміт + 1)),
// а для решти лишає ВСІ свічки, хоча klinesLimited (вікно аналізу) закінчується на ліміті.
// Через це klines і klinesLimited мають різну довжину, а код аналізу (наприклад analyzeFibanachi)
// індексує одне іншим і падає з "Cannot read properties of undefined (reading 'high')".
// true = поводитись з кожним інтервалом так, як застосунок поводиться з поточним: обрізати klines до кінця вікна аналізу.
const ALIGN_KLINES_TO_WINDOW = true;

const nextTick = () => new Promise(resolve => setTimeout(resolve, 0));
let multiRunId = 0; // новий натиск кнопки скасовує попередній прогін

/**
 * Готує дані одного інтервалу: свічки + маркери сценаріїв.
 *
 * ВАЖЛИВО: цей блок має бути СИНХРОННИМ (без await всередині).
 * getChartSettings() перезаписує ГЛОБАЛЬНІ klines (setKlines) свічками саме цього інтервалу,
 * а chartProcessor() читає ці глобальні klines. Тому свічки забираємо одразу після getChartSettings,
 * а chartProcessor і createScenariosMarker викликаємо, поки klines ще не змінились.
 */
function prepareIntervalData(interval) {
  if (!klinesData[interval] || klinesData[interval].length === 0) return null;

  const settings = getChartSettings(interval);

  if (ALIGN_KLINES_TO_WINDOW && settings.endRenderingDot < klines.length) {
    setKlines(klines.slice(0, settings.endRenderingDot));
  }

  const candles = klines; // живий імпорт: тут уже свічки цього інтервалу (з урахуванням ліміту)

  try {
    chartProcessor(settings, analyzeDataByInterval[interval]); // заповнює analyzeDataByInterval[interval]
  } catch (err) {
    // Контекст для діагностики: допоможе зрозуміти, чому аналіз падає саме на цьому інтервалі
    console.error(`[multi-backtest] контекст ${interval}:`, {
      mode,
      currentInterval,
      klinesLength: klines.length,
      klinesLimitedLength: settings.klinesLimited.length,
      startRenderingDot: settings.startRenderingDot,
      endRenderingDot: settings.endRenderingDot,
      alignKlinesToWindow: ALIGN_KLINES_TO_WINDOW,
    });
    throw err;
  }

  const markers = createScenariosMarker(analyzeDataByInterval[interval]);

  return { candles, markers };
}

/** Створює 5 блоків (заголовок + рядок підсумку + контейнер таблиці) у фіксованому порядку 1m → 1h */
function buildSlots(container) {
  container.innerHTML = '';
  const slots = {};

  for (const interval of MULTI_INTERVALS) {
    const section = document.createElement('section');
    section.style.marginBottom = '24px';
    section.innerHTML = `
      <h3 style="margin:0 0 8px;">Інтервал ${interval}</h3>
      <div data-role="overall"></div>
      <div data-role="list">Очікування…</div>
    `;
    container.appendChild(section);

    slots[interval] = {
      overallEl: section.querySelector('[data-role="overall"]'),
      listEl: section.querySelector('[data-role="list"]'),
    };
  }

  return slots;
}

/** Функція для кнопки */
export async function runMultiIntervalBacktest() {
  console.log('[multi-backtest] старт');

  const container = document.getElementById('multiBacktestContainer');
  if (!container) {
    console.warn('[multi-backtest] не знайдено елемент #multiBacktestContainer — додайте його в HTML');
    return;
  }

  const runId = ++multiRunId;
  const config = getConfigFromUI(); // один конфіг для всіх таймфреймів
  const holdModeChecked = !!document.getElementById('holdModeInput')?.checked;

  const slots = buildSlots(container);
  const results = {};

  try {
    // Фаза 1: по черзі готуємо дані й рахуємо бектест. Порядок 1m → 1h
    // (важливо для "синхронізації з 1m" в getChartSettings, яка спирається на ліміт 1m).
    for (const interval of MULTI_INTERVALS) {
      if (runId !== multiRunId) return;

      slots[interval].listEl.textContent = 'Готую дані…';
      await nextTick(); // дати браузеру показати статус

      try {
        const data = prepareIntervalData(interval); // синхронно!
        if (!data) {
          slots[interval].listEl.textContent = 'Немає даних для цього інтервалу (klinesData порожній).';
          continue;
        }

        slots[interval].listEl.textContent = 'Рахую бектест…';
        await nextTick();
        if (runId !== multiRunId) return;

        const report = holdModeChecked
          ? backtestMarkersHoldBars(data.candles, data.markers, config, interval)
          : backtestMarkers(data.candles, data.markers, config, interval);

        results[interval] = { ...data, report };
        renderResultsToUI(report, slots[interval]);
      } catch (err) {
        console.error(`[multi-backtest] помилка на ${interval}:`, err);
        slots[interval].listEl.textContent = `Помилка на ${interval}: ${err && err.message ? err.message : err}`;
      }
    }
  } finally {
    // getChartSettings міг залишити глобальні klines іншого інтервалу — повертаємо стан поточного
    if (runId === multiRunId) {
      try {
        getChartSettings(currentInterval);
      } catch (err) {
        console.error('[multi-backtest] не вдалось відновити klines поточного інтервалу:', err);
      }
    }
  }

  // Фаза 2 (необов'язкова): порівняння з рандомом, по черзі, коли всі таблиці вже є
  const random = getRandomOptionsFromUI();
  if (!random.enabled) return;

  for (const interval of MULTI_INTERVALS) {
    const result = results[interval];
    if (!result) continue;

    try {
      const full = await compareWithRandomEntry(result.candles, result.markers, config, interval, result.report, {
        holdMode: holdModeChecked,
        iterations: random.iterations,
        shouldCancel: () => runId !== multiRunId,
      });

      if (!full || runId !== multiRunId) return;
      renderResultsToUI(full, slots[interval]);
    } catch (err) {
      console.error(`[multi-backtest] помилка рандому на ${interval}:`, err);
    }
  }
}

function bindMultiBacktestButton() {
  const btn = document.getElementById('multiBacktestBtn');
  console.log('[multi-backtest] модуль підключено. Кнопка:', !!btn,
    '· контейнер:', !!document.getElementById('multiBacktestContainer'));

  btn?.addEventListener('click', () => {
    runMultiIntervalBacktest().catch(err => console.error('[multi-backtest] необроблена помилка:', err));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindMultiBacktestButton);
} else {
  bindMultiBacktestButton();
}