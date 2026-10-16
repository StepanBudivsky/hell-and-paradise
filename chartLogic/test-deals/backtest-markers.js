import { allScenarios } from "../../settingsData/all-scenarios.js";

/**
 * Розрахунок рівнів Stop Loss та Take Profit на базі ROE до маржі
 */
function calculateTargets({ entryPrice, directionType, scenario, config }) {
  const leverage = config.leverage ?? 1;

  // Конвертуємо бажаний % ROE до маржі у % руху базової ціни активу
  const targetRoeSL = config.slRoePercent ?? 10; // Наприклад, 10% мінусу від маржі
  const targetRoeTP = config.tpRoePercent ?? 30; // Наприклад, 30% плюсу від маржі

  const priceSlPercent = targetRoeSL / leverage;
  const priceTpPercent = targetRoeTP / leverage;

  let takeProfit = 0;
  let stopLoss = 0;

  if (directionType === 'LONG') {
    takeProfit = entryPrice * (1 + priceTpPercent / 100);
    stopLoss = entryPrice * (1 - priceSlPercent / 100);
  } else {
    // SHORT
    takeProfit = entryPrice * (1 - priceTpPercent / 100);
    stopLoss = entryPrice * (1 + priceSlPercent / 100);
  }

  return { takeProfit, stopLoss };
}

/**
 * Дістає "вид дії" сценарію (ВХІД / СТЕЖИТИ / ІГНОРУВАТИ).
 * УВАГА: назву поля в allScenarios я не бачив — якщо у вас воно називається
 * інакше, додайте його сюди.
 */
function getScenarioAction(scenario) {
  return scenario.action;
  // return scenario.action ?? scenario.actionType ?? scenario.actionName ?? '—';
}

/**
 * Переводить інтервал свічки в хвилини.
 * Приймає: число (вважається хвилинами: 1, 5, 15, 60...)
 * або рядок: '30s', '1m', '5m', '1h', '4h', '1d', '1w' (рядок без літери = хвилини).
 * Якщо не вдалося розпізнати — повертає null (колонки часу в хв покажуть "—").
 */
function parseIntervalToMinutes(interval) {
  if (typeof interval === 'number' && Number.isFinite(interval) && interval > 0) {
    return interval;
  }
  if (typeof interval === 'string') {
    const match = interval.trim().match(/^(\d+(?:\.\d+)?)\s*([smhdw]?)$/i);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      const multipliers = { s: 1 / 60, m: 1, '': 1, h: 60, d: 1440, w: 10080 };
      const minutes = value * multipliers[unit];
      if (minutes > 0) return minutes;
    }
  }
  return null;
}

/**
 * Бектестер маркерів по масиву свічок
 *
 * @param {Array} candles - Масив свічок [{ time, open, high, low, close }]
 * @param {Array} markers - Масив маркерів [{ time, text: "U2006", ... }]
 * @param {Object} config - Параметри тесту
 * @param {number|string} interval - Інтервал свічки (число = хвилини, або '5m' / '1h' / '1d')
 */
export function backtestMarkers(candles, markers, config = {}, interval) {
  const intervalMinutes = parseIntervalToMinutes(interval);

  const margin = config.margin ?? 100;
  const leverage = config.leverage ?? 20;
  const feeRate = config.feeRate ?? 0.05;

  // Ті самі дефолти, що і в calculateTargets (потрібні для виводу в таблиці)
  const tpRoePercent = config.tpRoePercent ?? 30;
  const slRoePercent = config.slRoePercent ?? 10;

  // Налаштування точки та часу входу:
  // entryBarOffset: 0 - на тій самій свічці, де маркер; 1 - на наступній свічці
  const entryBarOffset = config.entryBarOffset ?? 0;
  // entryPriceSource: 'open' | 'close' | 'high' | 'low'
  const entryPriceSource = config.entryPriceSource ?? 'close';

  // Метрика "свічок у правильний бік з входу":
  // якщо вхід по open — свічка входу теж ще "попереду" входу і враховується,
  // в інших випадках рахуємо лише свічки ПІСЛЯ свічки входу
  const countEntryCandleInStreak = entryPriceSource === 'open';

  // 1. Прив'язуємо маркери до індексів масиву свічок через Map
  const timeToIndex = new Map();
  for (let i = 0; i < candles.length; i++) {
    timeToIndex.set(candles[i].time, i);
  }

  // Черга відкладених входів: Map<candleIndex, Array<Marker>>
  const pendingEntriesByBarIndex = new Map();

  for (const m of markers) {
    const barIndex = timeToIndex.get(m.time);
    if (barIndex === undefined) continue;

    const targetEntryIndex = barIndex + entryBarOffset;
    if (targetEntryIndex >= candles.length) continue; // Вихід за межі історії

    if (!pendingEntriesByBarIndex.has(targetEntryIndex)) {
      pendingEntriesByBarIndex.set(targetEntryIndex, []);
    }
    pendingEntriesByBarIndex.get(targetEntryIndex).push(m);
  }

  const activeTrades = [];
  const closedTrades = [];

  // 2. Єдиний прохід по свічках
  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    // --- ВХІД У ПОЗИЦІЇ НА ПОТОЧНІЙ СВІЧЦІ ---
    if (pendingEntriesByBarIndex.has(i)) {
      const markersToEnter = pendingEntriesByBarIndex.get(i);

      for (const marker of markersToEnter) {
        const scenarioCode = marker.text;
        const scenario = allScenarios[scenarioCode];

        if (!scenario || scenario.direction === 0) continue;

        const directionType = scenario.direction === 1 ? 'LONG' : 'SHORT';
        const entryPrice = candle[entryPriceSource];

        const { takeProfit, stopLoss } = calculateTargets({
          entryPrice,
          directionType,
          scenario,
          config,
        });

        const notionalSize = margin * leverage;
        const contractsCount = notionalSize / entryPrice;

        activeTrades.push({
          scenarioCode,
          action: getScenarioAction(scenario), // вид дії сценарію
          type: directionType,
          entryPrice,
          takeProfit,
          stopLoss,
          entryTime: candle.time,
          entryBarIndex: i,
          margin,
          leverage,
          notionalSize,
          contractsCount,
          barsHeld: 0,
          maxPriceGainPercent: 0,
          maxPriceDropPercent: 0,
          maxRoePercent: 0,
          maxDrawdownRoe: 0,
          exitReason: null,
          exitPrice: null,
          exitTime: null,
          netProfitUSD: 0,
          finalRoePercent: 0,

          // НОВЕ: серія свічок з входу, що йдуть у правильний бік
          favorableStreak: 0,       // скільки свічок підряд закрилось "в плюс" до попередньої
          streakActive: true,       // серія ще не обірвалась
          streakRef: entryPrice,    // з чим порівнюємо close наступної свічки
        });
      }
    }

    if (activeTrades.length === 0) continue;

    // --- ОНОВЛЕННЯ ТА ЗАКРИТТЯ АКТИВНИХ ПОЗИЦІЙ ---
    for (let j = activeTrades.length - 1; j >= 0; j--) {
      const trade = activeTrades[j];
      trade.barsHeld += 1;

      // --- НОВЕ: серія свічок у правильному напрямку ---
      // Свічка "правильна", якщо її close краще за попередню точку відліку
      // (для першої — ціна входу, далі — close попередньої свічки).
      // Перша свічка, яка не пройшла (або дорівнює), обриває серію.
      if (trade.streakActive && (i > trade.entryBarIndex || countEntryCandleInStreak)) {
        const favorable = trade.type === 'LONG'
          ? candle.close > trade.streakRef
          : candle.close < trade.streakRef;

        if (favorable) {
          trade.favorableStreak += 1;
          trade.streakRef = candle.close;
        } else {
          trade.streakActive = false;
        }
      }

      let hitTP = false;
      let hitSL = false;

      if (trade.type === 'LONG') {
        const highPriceChange = ((candle.high - trade.entryPrice) / trade.entryPrice) * 100;
        const lowPriceChange = ((candle.low - trade.entryPrice) / trade.entryPrice) * 100;

        trade.maxPriceGainPercent = Math.max(trade.maxPriceGainPercent, highPriceChange);
        trade.maxPriceDropPercent = Math.min(trade.maxPriceDropPercent, lowPriceChange);
        trade.maxRoePercent = trade.maxPriceGainPercent * trade.leverage;
        trade.maxDrawdownRoe = trade.maxPriceDropPercent * trade.leverage;

        hitTP = candle.high >= trade.takeProfit;
        hitSL = candle.low <= trade.stopLoss;

        if (hitTP && hitSL) {
          trade.exitReason = 'SL';
          trade.exitPrice = trade.stopLoss;
        } else if (hitTP) {
          trade.exitReason = 'TP';
          trade.exitPrice = trade.takeProfit;
        } else if (hitSL) {
          trade.exitReason = 'SL';
          trade.exitPrice = trade.stopLoss;
        }
      } else {
        // SHORT
        const lowPriceChange = ((trade.entryPrice - candle.low) / trade.entryPrice) * 100;
        const highPriceChange = ((trade.entryPrice - candle.high) / trade.entryPrice) * 100;

        trade.maxPriceGainPercent = Math.max(trade.maxPriceGainPercent, lowPriceChange);
        trade.maxPriceDropPercent = Math.min(trade.maxPriceDropPercent, highPriceChange);
        trade.maxRoePercent = trade.maxPriceGainPercent * trade.leverage;
        trade.maxDrawdownRoe = trade.maxPriceDropPercent * trade.leverage;

        hitTP = candle.low <= trade.takeProfit;
        hitSL = candle.high >= trade.stopLoss;

        if (hitTP && hitSL) {
          trade.exitReason = 'SL';
          trade.exitPrice = trade.stopLoss;
        } else if (hitTP) {
          trade.exitReason = 'TP';
          trade.exitPrice = trade.takeProfit;
        } else if (hitSL) {
          trade.exitReason = 'SL';
          trade.exitPrice = trade.stopLoss;
        }
      }

      if (trade.exitReason) {
        trade.exitTime = candle.time;

        const priceDiff = trade.type === 'LONG'
          ? (trade.exitPrice - trade.entryPrice)
          : (trade.entryPrice - trade.exitPrice);

        const rawProfitUSD = priceDiff * trade.contractsCount;

        const entryFee = trade.notionalSize * (feeRate / 100);
        const exitFee = (trade.contractsCount * trade.exitPrice) * (feeRate / 100);

        trade.netProfitUSD = +(rawProfitUSD - (entryFee + exitFee)).toFixed(2);
        trade.finalRoePercent = +((trade.netProfitUSD / trade.margin) * 100).toFixed(2);

        closedTrades.push(trade);

        // O(1) видалення
        activeTrades[j] = activeTrades[activeTrades.length - 1];
        activeTrades.pop();
      }
    }
  }

  return summarize(closedTrades, activeTrades.length, {
    entryBarOffset,
    entryPriceSource,
    leverage,
    tpRoePercent,
    slRoePercent,
    intervalMinutes,
  });
}

/** min / max / avg по масиву чисел (без Math.min(...arr), щоб не впасти на великих масивах) */
function minMaxAvg(values) {
  if (values.length === 0) return { min: null, max: null, avg: null };
  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }
  return { min, max, avg: +(sum / values.length).toFixed(1) };
}

function summarize(closedTrades, stillOpenCount, meta) {
  const byScenario = {};

  for (const t of closedTrades) {
    if (!byScenario[t.scenarioCode]) {
      byScenario[t.scenarioCode] = [];
    }
    byScenario[t.scenarioCode].push(t);
  }

  const entryPointLabel =
    `${meta.entryPriceSource} / ` +
    (meta.entryBarOffset === 0 ? 'поточна свічка' : `+${meta.entryBarOffset} свічка`);

  const tpPricePct = +(meta.tpRoePercent / meta.leverage).toFixed(3);
  const slPricePct = +(meta.slRoePercent / meta.leverage).toFixed(3);

  const scenarioStats = {};

  for (const [code, trades] of Object.entries(byScenario)) {
    const tpTrades = trades.filter(t => t.exitReason === 'TP');
    const slTrades = trades.filter(t => t.exitReason === 'SL');

    const tpBars = minMaxAvg(tpTrades.map(t => t.barsHeld));
    const slBars = minMaxAvg(slTrades.map(t => t.barsHeld));
    const allBars = minMaxAvg(trades.map(t => t.barsHeld));

    // НОВЕ: мін / сер. / макс свічок з входу у правильний бік
    const streak = minMaxAvg(trades.map(t => t.favorableStreak));

    // НОВЕ: час угоди в хвилинах = кількість свічок * інтервал свічки
    const durationMin = meta.intervalMinutes
      ? minMaxAvg(trades.map(t => t.barsHeld * meta.intervalMinutes))
      : { min: null, max: null, avg: null };

    const totalNetUSD = +trades.reduce((sum, t) => sum + t.netProfitUSD, 0).toFixed(2);
    const avgNetUSD = +(totalNetUSD / trades.length).toFixed(2);
    const avgRoePercent = +(
      trades.reduce((sum, t) => sum + t.finalRoePercent, 0) / trades.length
    ).toFixed(2);

    scenarioStats[code] = {
      id: code,
      action: trades[0].action,
      direction: trades[0].type,
      entryPoint: entryPointLabel,

      totalSignals: trades.length,

      tpRoe: meta.tpRoePercent,
      tpPricePct,
      slRoe: meta.slRoePercent,
      slPricePct,

      tpCount: tpTrades.length,
      tpAvgBars: tpBars.avg,
      tpMinBars: tpBars.min,
      tpMaxBars: tpBars.max,

      slCount: slTrades.length,
      slAvgBars: slBars.avg,
      slMinBars: slBars.min,
      slMaxBars: slBars.max,

      totalNetUSD,
      avgNetUSD,
      avgRoePercent,
      isProfitable: totalNetUSD > 0,

      winRate: +((tpTrades.length / trades.length) * 100).toFixed(2),

      barsAvg: allBars.avg,
      barsMin: allBars.min,
      barsMax: allBars.max,

      streakMin: streak.min,
      streakAvg: streak.avg,
      streakMax: streak.max,

      durationMinMin: durationMin.min,
      durationMinAvg: durationMin.avg,
      durationMinMax: durationMin.max,
    };
  }

  return {
    totalClosed: closedTrades.length,
    stillOpen: stillOpenCount,
    scenarioStats,
    trades: closedTrades,
  };
}

/**
 * Зчитує актуальні значення з DOM-елементів та формує конфіг
 */
export function getConfigFromUI() {
  const margin = parseFloat(document.getElementById('cashInputParametr').value) || 100;
  const leverage = parseFloat(document.getElementById('shoulderInputParametr').value) || 20;
  const tpRoe = parseFloat(document.getElementById('takeProfitAmountInputParametr').value) || 30;

  // Якщо введено -10, Math.abs дасть додатне число для внутрішніх формул
  const rawSL = parseFloat(document.getElementById('stopLossAmountInputParametr').value) || 10;
  const slRoe = Math.abs(rawSL);

  const entryBarOffset = parseInt(document.getElementById('candleOffsetInput').value, 10) || 0;
  const entryPriceSource = document.getElementById('candleStartParameter').value || 'open';

  return {
    margin,
    leverage,
    tpRoePercent: tpRoe,
    slRoePercent: slRoe,
    entryBarOffset,
    entryPriceSource,
    feeRate: 0, // Базова taker-комісія
  };
}

/* ======================= ТАБЛИЦЯ РЕЗУЛЬТАТІВ ======================= */

const dash = v => (v === null || v === undefined ? '—' : v);

const pnlColor = v => (v > 0 ? '#26a69a' : v < 0 ? '#ef5350' : 'inherit');
const colored = (v, text) => `<span style="color:${pnlColor(v)};font-weight:bold;">${text}</span>`;
const signed = v => `${v > 0 ? '+' : ''}${v}`;

const COLUMNS = [
  { key: 'id', label: 'ID', sticky: true, render: r => `<b>${r.id}</b>` },
  { key: 'action', label: 'Вид дії', render: r => dash(r.action) },
  {
    key: 'direction',
    label: 'Напрям',
    render: r =>
      `<span style="color:${r.direction === 'LONG' ? '#26a69a' : '#ef5350'};font-weight:bold;">${r.direction}</span>`,
  },
  { key: 'entryPoint', label: 'Вхід (ціна / свічка)' },
  { key: 'totalSignals', label: 'Кількість разів' },

  { key: 'tpRoe', label: 'TP', render: r => `${r.tpRoe}% ROE <small>(${r.tpPricePct}% ціни)</small>` },
  { key: 'slRoe', label: 'SL', render: r => `${r.slRoe}% ROE <small>(${r.slPricePct}% ціни)</small>` },

  { key: 'tpCount', label: 'TP, разів' },
  { key: 'tpAvgBars', label: 'До TP: сер. (св.)', render: r => dash(r.tpAvgBars) },
  { key: 'tpMinBars', label: 'До TP: мін', render: r => dash(r.tpMinBars) },
  { key: 'tpMaxBars', label: 'До TP: макс', render: r => dash(r.tpMaxBars) },

  { key: 'slCount', label: 'SL, разів' },
  { key: 'slAvgBars', label: 'До SL: сер. (св.)', render: r => dash(r.slAvgBars) },
  { key: 'slMinBars', label: 'До SL: мін', render: r => dash(r.slMinBars) },
  { key: 'slMaxBars', label: 'До SL: макс', render: r => dash(r.slMaxBars) },

  { key: 'totalNetUSD', label: 'PnL, $', render: r => colored(r.totalNetUSD, `${signed(r.totalNetUSD)} $`) },
  {
    key: 'avgNetUSD',
    label: 'Сер. PnL / угоду',
    render: r =>
      colored(r.avgNetUSD, `${signed(r.avgNetUSD)} $`) +
      ` <small>(${signed(r.avgRoePercent)}% ROE)</small>`,
  },
  {
    key: 'isProfitable',
    label: 'Плюсовий?',
    render: r =>
      r.isProfitable
        ? '<span style="color:#26a69a;font-weight:bold;">ТАК</span>'
        : '<span style="color:#ef5350;font-weight:bold;">НІ</span>',
  },
  { key: 'winRate', label: 'WinRate', render: r => `${r.winRate}%` },

  { key: 'barsAvg', label: 'Час угоди: сер. (св.)' },
  { key: 'barsMin', label: 'Час угоди: мін' },
  { key: 'barsMax', label: 'Час угоди: макс' },

  // НОВЕ: свічок з входу у правильний бік
  { key: 'streakMin', label: 'Свічок у правильний бік: мін' },
  { key: 'streakAvg', label: 'Свічок у правильний бік: сер.' },
  { key: 'streakMax', label: 'Свічок у правильний бік: макс' },

  // НОВЕ: час угоди в хвилинах
  { key: 'durationMinMin', label: 'Час угоди, хв: мін', render: r => dash(r.durationMinMin) },
  { key: 'durationMinAvg', label: 'Час угоди, хв: сер.', render: r => dash(r.durationMinAvg) },
  { key: 'durationMinMax', label: 'Час угоди, хв: макс', render: r => dash(r.durationMinMax) },
];

let lastRows = [];
let sortState = { key: 'totalNetUSD', dir: -1 }; // -1 = спадання

function compareRows(a, b, key, dir) {
  const va = a[key];
  const vb = b[key];
  if (va === null || va === undefined) return 1; // порожні завжди внизу
  if (vb === null || vb === undefined) return -1;
  if (typeof va === 'string') return va.localeCompare(vb) * dir;
  return (va - vb) * dir;
}

function drawTable(listEl) {
  const rows = [...lastRows].sort((a, b) => compareRows(a, b, sortState.key, sortState.dir));

  const thStyle =
    'padding:6px 8px;text-align:left;cursor:pointer;white-space:nowrap;' +
    'border-bottom:1px solid rgb(223, 223, 223);position:sticky;top:0;background:#ffffff;';
  const tdStyle = 'padding:5px 8px;white-space:nowrap;border-bottom:1px solid rgb(231, 226, 226);';

  const head = COLUMNS.map(c => {
    const arrow = sortState.key === c.key ? (sortState.dir === 1 ? ' ▲' : ' ▼') : '';
    const sticky = c.sticky ? 'left:0;z-index:2;' : '';
    return `<th data-key="${c.key}" style="${thStyle}${sticky}">${c.label}${arrow}</th>`;
  }).join('');

  const body = rows
    .map(r => {
      const cells = COLUMNS.map(c => {
        const content = c.render ? c.render(r) : dash(r[c.key]);
        const sticky = c.sticky ? 'position:sticky;left:0;background:#ffffff;' : '';
        return `<td style="${tdStyle}${sticky}">${content}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  listEl.innerHTML = `
    <div style="overflow-x:auto;max-height:70vh;">
      <table style="border-collapse:collapse;font-size:12px;width:100%;">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;

  listEl.querySelectorAll('th[data-key]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      sortState = {
        key,
        dir: sortState.key === key ? -sortState.dir : -1,
      };
      drawTable(listEl);
    });
  });
}

/**
 * Відображає розраховані результати в DOM-елементах
 */
export function renderResultsToUI(report) {
  const overallEl = document.getElementById('overallStats');
  const listEl = document.getElementById('scenariosStatsList');

  if (!overallEl || !listEl) return;

  overallEl.innerHTML = `
    <div>Закрито угод: <span>${report.totalClosed}</span> (Ще відкрито: ${report.stillOpen})</div>
  `;

  lastRows = Object.values(report.scenarioStats);

  if (lastRows.length === 0) {
    listEl.innerHTML = '<p>Немає закритих угод для відображення.</p>';
    return;
  }

  drawTable(listEl);
}