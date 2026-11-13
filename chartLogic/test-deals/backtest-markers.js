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

      // ФІКС: якщо вхід НЕ по open, то high/low свічки входу були ДО самого входу,
      // тому свічку входу пропускаємо повністю (TP/SL, серія, barsHeld).
      if (trade.entryBarIndex === i && entryPriceSource !== 'open') continue;

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

/**
 * РЕЖИМ "ЛІМІТ СВІЧОК" (без TP і SL).
 *
 * Кожна угода відкривається за тими самими правилами входу (entryBarOffset / entryPriceSource),
 * а закривається по ЗАКРИТТЮ свічки номер `holdBars` після входу.
 * Єдине виключення — ліквідація (див. simulateLiquidation нижче).
 *
 * config.holdBars            - ліміт свічок (за замовчуванням 5)
 * config.simulateLiquidation - true (за замовчуванням): якщо ціна проти угоди проходить
 *                              рівень ліквідації (вхід ∓ 1/плече), угода закривається
 *                              з втратою всієї маржі. Спрощення: не враховує maintenance margin
 *                              і комісію ліквідації Binance (реальна ліквідація трохи ближча).
 *                              Постав false, щоб зовсім без обмежень.
 *
 * Нумерація свічок: при вході по open свічка входу = свічка №1;
 * при вході по close/high/low свічка №1 — наступна після свічки входу.
 * Тобто в обох випадках угода "живе" рівно holdBars свічок.
 */
export function backtestMarkersHoldBars(candles, markers, config = {}, interval) {
  const intervalMinutes = parseIntervalToMinutes(interval);

  const margin = config.margin ?? 100;
  const leverage = config.leverage ?? 20;
  const feeRate = config.feeRate ?? 0.05;
  const holdBars = Math.max(1, Math.floor(Number(config.holdBars) || 5));
  const simulateLiquidation = config.simulateLiquidation ?? true;

  const entryBarOffset = config.entryBarOffset ?? 0;
  const entryPriceSource = config.entryPriceSource ?? 'close';
  const countEntryCandleInStreak = entryPriceSource === 'open';

  // 1. Черга входів по індексах свічок
  const timeToIndex = new Map();
  for (let i = 0; i < candles.length; i++) {
    timeToIndex.set(candles[i].time, i);
  }

  const pendingEntriesByBarIndex = new Map();
  for (const m of markers) {
    const barIndex = timeToIndex.get(m.time);
    if (barIndex === undefined) continue;

    const targetEntryIndex = barIndex + entryBarOffset;
    if (targetEntryIndex >= candles.length) continue;

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

    // --- ВХІД ---
    if (pendingEntriesByBarIndex.has(i)) {
      for (const marker of pendingEntriesByBarIndex.get(i)) {
        const scenarioCode = marker.text;
        const scenario = allScenarios[scenarioCode];

        if (!scenario || scenario.direction === 0) continue;

        const directionType = scenario.direction === 1 ? 'LONG' : 'SHORT';
        const entryPrice = candle[entryPriceSource];

        const notionalSize = margin * leverage;
        const contractsCount = notionalSize / entryPrice;

        const liquidationPrice = directionType === 'LONG'
          ? entryPrice * (1 - 1 / leverage)
          : entryPrice * (1 + 1 / leverage);

        activeTrades.push({
          scenarioCode,
          action: getScenarioAction(scenario),
          type: directionType,
          entryPrice,
          liquidationPrice,
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
          feesUSD: 0,
          netProfitUSD: 0,
          finalRoePercent: 0,
          favorableStreak: 0,
          streakActive: true,
          streakRef: entryPrice,
        });
      }
    }

    if (activeTrades.length === 0) continue;

    // --- ОНОВЛЕННЯ ТА ЗАКРИТТЯ ---
    for (let j = activeTrades.length - 1; j >= 0; j--) {
      const trade = activeTrades[j];

      // Свічка входу пропускається, якщо вхід не по open (її high/low були до входу)
      if (trade.entryBarIndex === i && entryPriceSource !== 'open') continue;

      trade.barsHeld += 1;

      // Серія свічок у правильний бік (та сама логіка, що й у режимі TP/SL)
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

      // Пік у плюс (MFE) і найглибша просадка (MAE) за час угоди
      const favorableMove = trade.type === 'LONG'
        ? ((candle.high - trade.entryPrice) / trade.entryPrice) * 100
        : ((trade.entryPrice - candle.low) / trade.entryPrice) * 100;
      const adverseMove = trade.type === 'LONG'
        ? ((candle.low - trade.entryPrice) / trade.entryPrice) * 100
        : ((trade.entryPrice - candle.high) / trade.entryPrice) * 100;

      trade.maxPriceGainPercent = Math.max(trade.maxPriceGainPercent, favorableMove);
      trade.maxPriceDropPercent = Math.min(trade.maxPriceDropPercent, adverseMove);
      trade.maxRoePercent = trade.maxPriceGainPercent * trade.leverage;
      trade.maxDrawdownRoe = trade.maxPriceDropPercent * trade.leverage;

      // --- ВИХІД: ліквідація або закриття свічки №holdBars ---
      let exitReason = null;
      let exitPrice = null;

      if (simulateLiquidation) {
        const liquidated = trade.type === 'LONG'
          ? candle.low <= trade.liquidationPrice
          : candle.high >= trade.liquidationPrice;
        if (liquidated) {
          exitReason = 'LIQ';
          exitPrice = trade.liquidationPrice;
        }
      }

      if (!exitReason && trade.barsHeld >= holdBars) {
        exitReason = 'TIME';
        exitPrice = candle.close;
      }

      if (exitReason) {
        trade.exitReason = exitReason;
        trade.exitPrice = exitPrice;
        trade.exitTime = candle.time;

        const priceDiff = trade.type === 'LONG'
          ? (exitPrice - trade.entryPrice)
          : (trade.entryPrice - exitPrice);

        const rawProfitUSD = priceDiff * trade.contractsCount;
        const entryFee = trade.notionalSize * (feeRate / 100);
        const exitFee = (trade.contractsCount * exitPrice) * (feeRate / 100);

        trade.feesUSD = entryFee + exitFee;
        trade.netProfitUSD = +(rawProfitUSD - trade.feesUSD).toFixed(2);
        trade.finalRoePercent = +((trade.netProfitUSD / trade.margin) * 100).toFixed(2);

        closedTrades.push(trade);

        activeTrades[j] = activeTrades[activeTrades.length - 1];
        activeTrades.pop();
      }
    }
  }

  return summarizeHold(closedTrades, activeTrades.length, {
    entryBarOffset,
    entryPriceSource,
    holdBars,
    intervalMinutes,
    simulateLiquidation,
  });
}

function medianOf(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function averageOf(values) {
  if (values.length === 0) return null;
  let sum = 0;
  for (const v of values) sum += v;
  return sum / values.length;
}

const round2 = v => (v === null || v === undefined ? null : +v.toFixed(2));

function summarizeHold(closedTrades, stillOpenCount, meta) {
  const byScenario = {};
  for (const t of closedTrades) {
    if (!byScenario[t.scenarioCode]) byScenario[t.scenarioCode] = [];
    byScenario[t.scenarioCode].push(t);
  }

  const entryPointLabel =
    `${meta.entryPriceSource} / ` +
    (meta.entryBarOffset === 0 ? 'поточна свічка' : `+${meta.entryBarOffset} свічка`);

  const holdLabel = meta.intervalMinutes
    ? `${meta.holdBars} св. (${+(meta.holdBars * meta.intervalMinutes).toFixed(2)} хв)`
    : `${meta.holdBars} св.`;

  const scenarioStats = {};
  let overallNetUSD = 0;

  for (const [code, trades] of Object.entries(byScenario)) {
    const pnls = trades.map(t => t.netProfitUSD);
    const wins = pnls.filter(v => v > 0);
    const losses = pnls.filter(v => v <= 0);

    const grossProfitUSD = wins.reduce((s, v) => s + v, 0);
    const grossLossUSD = losses.reduce((s, v) => s + v, 0); // від'ємне або 0
    const totalNetUSD = round2(grossProfitUSD + grossLossUSD);
    overallNetUSD += totalNetUSD;

    // Крива капіталу по сценарію (угоди вже в порядку закриття): макс. просадка і серія збитків
    let cumulative = 0;
    let peak = 0;
    let maxDrawdownUSD = 0;
    let currentLossStreak = 0;
    let maxLossStreak = 0;
    for (const v of pnls) {
      cumulative += v;
      if (cumulative > peak) peak = cumulative;
      if (peak - cumulative > maxDrawdownUSD) maxDrawdownUSD = peak - cumulative;

      if (v <= 0) {
        currentLossStreak += 1;
        if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
      } else {
        currentLossStreak = 0;
      }
    }

    const streak = minMaxAvg(trades.map(t => t.favorableStreak));
    const mfe = trades.map(t => t.maxRoePercent);
    const mae = trades.map(t => t.maxDrawdownRoe);
    const pnlRange = minMaxAvg(pnls);   // min / max без spread (безпечно для великих масивів)
    const maeRange = minMaxAvg(mae);

    scenarioStats[code] = {
      id: code,
      action: trades[0].action,
      direction: trades[0].type,
      entryPoint: entryPointLabel,
      holdLabel,

      totalSignals: trades.length,
      winCount: wins.length,
      lossCount: losses.length,
      winRate: +((wins.length / trades.length) * 100).toFixed(2),

      totalNetUSD,
      avgNetUSD: round2(totalNetUSD / trades.length),
      avgRoePercent: round2(averageOf(trades.map(t => t.finalRoePercent))),
      medianNetUSD: round2(medianOf(pnls)),
      isProfitable: totalNetUSD > 0,

      grossProfitUSD: round2(grossProfitUSD),
      grossLossUSD: round2(grossLossUSD),
      profitFactor: grossLossUSD === 0 ? null : round2(grossProfitUSD / Math.abs(grossLossUSD)),
      avgWinUSD: round2(averageOf(wins)),
      avgLossUSD: round2(averageOf(losses)),
      bestTradeUSD: pnlRange.max,
      worstTradeUSD: pnlRange.min,

      maxDrawdownUSD: round2(maxDrawdownUSD),
      maxLossStreak,
      liqCount: trades.filter(t => t.exitReason === 'LIQ').length,
      feesUSD: round2(trades.reduce((s, t) => s + t.feesUSD, 0)),

      avgMfeRoe: round2(averageOf(mfe)),
      avgMaeRoe: round2(averageOf(mae)),
      worstMaeRoe: round2(maeRange.min),

      streakMin: streak.min,
      streakAvg: streak.avg,
      streakMax: streak.max,
    };
  }

  return {
    mode: 'HOLD',
    holdBars: meta.holdBars,
    totalClosed: closedTrades.length,
    stillOpen: stillOpenCount,
    overallNetUSD: round2(overallNetUSD),
    scenarioStats,
    trades: closedTrades,
  };
}

/* ===================== ПОРІВНЯННЯ З РАНДОМНИМ ВХОДОМ ===================== */

/** Детермінований генератор (mulberry32): однаковий seed → однакові "випадкові" входи між запусками */
function createRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function quantileOfSorted(sorted, q) {
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/**
 * Порівняння кожного сценарію з РАНДОМНИМИ входами (Монте-Карло).
 *
 * Для кожного сценарію береться стільки ж сигналів, скільки було реально, з тим самим напрямком
 * (LONG-сценарій порівнюється з випадковими LONG-входами), але у випадкові свічки.
 * Далі запускається ТОЙ САМИЙ бектестер з тим самим конфігом (TP/SL або ліміт свічок, комісії,
 * плече, точка входу) — тому правила гарантовано однакові. Так повторюється `iterations` разів,
 * і виходить розподіл "що дав би випадковий вхід". Потім реальний результат ставиться на цей розподіл.
 *
 * Випадкові входи беруться лише з діапазону свічок, де система реально давала сигнали
 * (від першого до останнього маркера), щоб не потрапляти в період прогріву індикаторів.
 *
 * @param {Object} realReport - результат backtestMarkers / backtestMarkersHoldBars
 * @param {Object} options - { holdMode, iterations=200, seed=12345, alpha=0.05, onProgress, shouldCancel }
 * @returns {Promise<Object|null>} звіт з доданими полями rnd... та edge...; null якщо скасовано / нема даних
 */
export async function compareWithRandomEntry(candles, markers, config, interval, realReport, options = {}) {
  const {
    holdMode = false,
    iterations = 200,
    seed = 12345,
    alpha = 0.05,
    onProgress = null,
    shouldCancel = null,
  } = options;

  const runner = holdMode ? backtestMarkersHoldBars : backtestMarkers;
  const entryBarOffset = config.entryBarOffset ?? 0;
  const rng = createRng(seed);

  // 1) Скільки реальних сигналів у кожного сценарію і в якому діапазоні свічок вони лежать
  const timeToIndex = new Map();
  for (let i = 0; i < candles.length; i++) timeToIndex.set(candles[i].time, i);

  const countByCode = {};
  let minIdx = Infinity;
  let maxIdx = -Infinity;

  for (const m of markers) {
    const idx = timeToIndex.get(m.time);
    if (idx === undefined) continue;

    const scenario = allScenarios[m.text];
    if (!scenario || scenario.direction === 0) continue;
    if (idx + entryBarOffset >= candles.length) continue;

    countByCode[m.text] = (countByCode[m.text] ?? 0) + 1;
    if (idx < minIdx) minIdx = idx;
    if (idx > maxIdx) maxIdx = idx;
  }

  const codes = Object.keys(countByCode);
  if (codes.length === 0) return null;
  const span = maxIdx - minIdx + 1;

  // 2) Монте-Карло: iterations прогонів з випадковими входами
  const samples = {};
  for (const code of codes) samples[code] = { avg: [], win: [] };

  for (let it = 0; it < iterations; it++) {
    if (shouldCancel && shouldCancel()) return null;

    const randomMarkers = [];
    for (const code of codes) {
      for (let k = 0; k < countByCode[code]; k++) {
        randomMarkers.push({
          time: candles[minIdx + Math.floor(rng() * span)].time,
          text: code,
        });
      }
    }

    const rep = runner(candles, randomMarkers, config, interval);
    for (const code of codes) {
      const st = rep.scenarioStats[code];
      if (!st) continue; // жодної закритої угоди в цьому прогоні
      samples[code].avg.push(st.avgNetUSD);
      samples[code].win.push(st.winRate);
    }

    if (onProgress) onProgress(it + 1, iterations);
    // віддаємо керування браузеру, щоб інтерфейс не "замерзав"
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  // 3) Ставимо реальний результат на розподіл випадкових
  const stats = {};
  let better = 0;
  let worse = 0;
  let same = 0;
  let counted = 0;
  let usedIterations = 0;

  for (const [code, real] of Object.entries(realReport.scenarioStats)) {
    const s = samples[code];

    if (!s || s.avg.length < 20) {
      stats[code] = { ...real, verdict: null };
      continue;
    }

    const n = s.avg.length;
    usedIterations = Math.max(usedIterations, n);

    const sorted = [...s.avg].sort((a, b) => a - b);
    const meanAvg = s.avg.reduce((sum, v) => sum + v, 0) / n;
    const meanWin = s.win.reduce((sum, v) => sum + v, 0) / n;

    let lower = 0;   // скільки випадкових прогонів гірші за реальний
    let equal = 0;
    let atLeast = 0; // >= реального
    let atMost = 0;  // <= реального
    for (const v of s.avg) {
      if (v < real.avgNetUSD) lower += 1;
      else if (v === real.avgNetUSD) equal += 1;
      if (v >= real.avgNetUSD) atLeast += 1;
      if (v <= real.avgNetUSD) atMost += 1;
    }

    const pBetter = (atLeast + 1) / (n + 1); // шанс отримати ТАКИЙ ЖЕ або кращий результат випадково
    const pWorse = (atMost + 1) / (n + 1);

    let verdict = 'SAME';
    if (pBetter <= alpha) verdict = 'BETTER';
    else if (pWorse <= alpha) verdict = 'WORSE';

    counted += 1;
    if (verdict === 'BETTER') better += 1;
    else if (verdict === 'WORSE') worse += 1;
    else same += 1;

    stats[code] = {
      ...real,
      rndIterations: n,
      rndAvgNetUSD: round2(meanAvg),
      rndP5: round2(quantileOfSorted(sorted, 0.05)),
      rndP95: round2(quantileOfSorted(sorted, 0.95)),
      rndWinRate: round2(meanWin),
      edgeAvgUSD: round2(real.avgNetUSD - meanAvg),
      edgeWinRate: round2(real.winRate - meanWin),
      percentile: round2(((lower + 0.5 * equal) / n) * 100),
      pValue: round2(pBetter) === 0 ? +pBetter.toFixed(4) : round2(pBetter),
      verdict,
    };
  }

  return {
    ...realReport,
    scenarioStats: stats,
    randomSummary: {
      iterations: usedIterations,
      alpha,
      total: counted,
      better,
      worse,
      same,
      expectedByChance: +(counted * alpha).toFixed(1),
    },
  };
}

/** Читає налаштування порівняння з рандомом з UI */
export function getRandomOptionsFromUI() {
  const enabledEl = document.getElementById('randomCompareInput');
  const iterEl = document.getElementById('randomIterationsInput');
  const iterations = Math.min(2000, Math.max(20, parseInt(iterEl ? iterEl.value : '', 10) || 200));
  return { enabled: !!(enabledEl && enabledEl.checked), iterations };
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

  // Комісія в % від notional (0.05 = 0.05%). Підтримує кому ("0,05").
  // Окремо від "|| дефолт", бо 0 — валідне значення (тест без комісії).
  const feeInputEl = document.getElementById('feeRateInputParametr');
  const parsedFee = feeInputEl
    ? parseFloat(String(feeInputEl.value).replace(',', '.'))
    : NaN;
  const feeRate = Number.isFinite(parsedFee) && parsedFee >= 0 ? parsedFee : 0.05;

  // Режим "ліміт свічок": скільки свічок тримати угоду (інпут id="holdBarsInputParametr")
  const holdBarsEl = document.getElementById('holdBarsInputParametr');
  const holdBars = Math.max(1, parseInt(holdBarsEl ? holdBarsEl.value : '', 10) || 5);

  // Чекбокс id="simulateLiquidationInput": якщо його нема — ліквідація ввімкнена
  const liqEl = document.getElementById('simulateLiquidationInput');
  const simulateLiquidation = liqEl ? liqEl.checked : true;

  return {
    margin,
    leverage,
    holdBars,
    simulateLiquidation,
    tpRoePercent: tpRoe,
    slRoePercent: slRoe,
    entryBarOffset,
    entryPriceSource,
    feeRate, // % від notional, береться з інпута (дефолт 0.05 = taker Binance)
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

/* ---------- Колонки для режиму "ЛІМІТ СВІЧОК" ---------- */

const pickCol = key => COLUMNS.find(c => c.key === key);

const usdCell = v => (v === null || v === undefined ? '—' : colored(v, `${signed(v)} $`));
const pctCell = v => (v === null || v === undefined ? '—' : `${signed(v)}%`);

const HOLD_COLUMNS = [
  pickCol('id'),
  pickCol('action'),
  pickCol('direction'),
  pickCol('entryPoint'),
  { key: 'holdLabel', label: 'Ліміт тримання' },
  { key: 'totalSignals', label: 'Кількість угод' },

  { key: 'winCount', label: 'В плюс, разів' },
  { key: 'lossCount', label: 'В мінус, разів' },
  pickCol('winRate'),

  pickCol('totalNetUSD'),
  pickCol('avgNetUSD'),
  { key: 'medianNetUSD', label: 'Медіана PnL, $', render: r => usdCell(r.medianNetUSD) },
  pickCol('isProfitable'),

  { key: 'grossProfitUSD', label: 'Сума прибутків, $', render: r => usdCell(r.grossProfitUSD) },
  { key: 'grossLossUSD', label: 'Сума збитків, $', render: r => usdCell(r.grossLossUSD) },
  {
    key: 'profitFactor',
    label: 'Profit Factor',
    render: r => (r.profitFactor === null ? (r.grossProfitUSD > 0 ? '∞' : '—') : r.profitFactor),
  },
  { key: 'avgWinUSD', label: 'Сер. прибуток угоди, $', render: r => usdCell(r.avgWinUSD) },
  { key: 'avgLossUSD', label: 'Сер. збиток угоди, $', render: r => usdCell(r.avgLossUSD) },
  { key: 'bestTradeUSD', label: 'Найкраща угода, $', render: r => usdCell(r.bestTradeUSD) },
  { key: 'worstTradeUSD', label: 'Найгірша угода, $', render: r => usdCell(r.worstTradeUSD) },

  { key: 'maxDrawdownUSD', label: 'Макс. просадка серії, $', render: r => `${r.maxDrawdownUSD} $` },
  { key: 'maxLossStreak', label: 'Макс. збиткових підряд' },
  { key: 'liqCount', label: 'Ліквідацій' },
  { key: 'feesUSD', label: 'Комісії, $', render: r => `${r.feesUSD} $` },

  { key: 'avgMfeRoe', label: 'Сер. пік ROE (MFE)', render: r => pctCell(r.avgMfeRoe) },
  { key: 'avgMaeRoe', label: 'Сер. просадка ROE (MAE)', render: r => pctCell(r.avgMaeRoe) },
  { key: 'worstMaeRoe', label: 'Найгірша просадка ROE', render: r => pctCell(r.worstMaeRoe) },

  pickCol('streakMin'),
  pickCol('streakAvg'),
  pickCol('streakMax'),
];

/* ---------- Колонки порівняння з рандомним входом ---------- */

const ppCell = v => (v === null || v === undefined ? '—' : colored(v, `${signed(v)} п.п.`));

const verdictCell = v => {
  if (v === 'BETTER') return '<span style="color:#26a69a;font-weight:bold;">краще за рандом</span>';
  if (v === 'WORSE') return '<span style="color:#ef5350;font-weight:bold;">гірше за рандом</span>';
  if (v === 'SAME') return '<span style="opacity:0.7;">≈ рандом</span>';
  return '—';
};

const RANDOM_COLUMNS = [
  {
    key: 'rndAvgNetUSD',
    label: 'Рандом: сер. PnL / угоду (5–95%)',
    render: r =>
      r.rndAvgNetUSD === undefined
        ? '—'
        : `${signed(r.rndAvgNetUSD)} $ <small>(${signed(r.rndP5)} … ${signed(r.rndP95)})</small>`,
  },
  { key: 'rndWinRate', label: 'Рандом: WinRate', render: r => (r.rndWinRate === undefined ? '—' : `${r.rndWinRate}%`) },
  { key: 'edgeAvgUSD', label: 'Перевага над рандомом, $ / угоду', render: r => usdCell(r.edgeAvgUSD) },
  { key: 'edgeWinRate', label: 'Перевага WinRate', render: r => ppCell(r.edgeWinRate) },
  {
    key: 'percentile',
    label: 'Перцентиль (кращий за % рандому)',
    render: r => (r.percentile === undefined ? '—' : `${r.percentile}%`),
  },
  { key: 'pValue', label: 'p-value', render: r => dash(r.pValue) },
  { key: 'verdict', label: 'Вердикт', render: r => verdictCell(r.verdict) },
];

let lastRows = [];
let activeColumns = COLUMNS;
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

  const head = activeColumns.map(c => {
    const arrow = sortState.key === c.key ? (sortState.dir === 1 ? ' ▲' : ' ▼') : '';
    const sticky = c.sticky ? 'left:0;z-index:2;' : '';
    return `<th data-key="${c.key}" style="${thStyle}${sticky}">${c.label}${arrow}</th>`;
  }).join('');

  const body = rows
    .map(r => {
      const cells = activeColumns.map(c => {
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

  const isHold = report.mode === 'HOLD';
  activeColumns = isHold ? HOLD_COLUMNS : COLUMNS;
  if (report.randomSummary) activeColumns = [...activeColumns, ...RANDOM_COLUMNS];

  // Якщо колонки, по якій сортували, нема в новому режимі — скидаємо сортування
  if (!activeColumns.some(c => c.key === sortState.key)) {
    sortState = { key: 'totalNetUSD', dir: -1 };
  }

  overallEl.innerHTML = isHold
    ? `
    <div>
      Режим: ліміт <b>${report.holdBars}</b> св. (без TP/SL) ·
      Закрито угод: <span>${report.totalClosed}</span>
      (не дожили до ліміту через кінець історії: ${report.stillOpen}) ·
      Сумарний PnL: ${usdCell(report.overallNetUSD)}
    </div>`
    : `
    <div>Закрито угод: <span>${report.totalClosed}</span> (Ще відкрито: ${report.stillOpen})</div>
  `;

  if (report.randomSummary) {
    const rs = report.randomSummary;
    overallEl.innerHTML += `
    <div>
      Порівняння з рандомним входом (${rs.iterations} прогонів, поріг p ≤ ${rs.alpha}):
      краще за рандом <b>${rs.better}</b> з ${rs.total},
      гірше <b>${rs.worse}</b>, на рівні рандому ${rs.same}.
      Чисто випадково "кращими" вийшло б ≈ ${rs.expectedByChance}.
    </div>`;
  }

  lastRows = Object.values(report.scenarioStats);

  if (lastRows.length === 0) {
    listEl.innerHTML = '<p>Немає закритих угод для відображення.</p>';
    return;
  }

  drawTable(listEl);
}